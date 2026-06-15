const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    UnderlineType,
    ImageRun,
} = require("docx");
const PDFDocument = require("pdfkit");
const MarkdownIt = require("markdown-it");
const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

const md = new MarkdownIt();
//typography configuration for markdown-it
const DOCK_STYLES = {
    fonts: {
        fonts:{
            body:"charter",
            heading:"inter",
        },
        sizes:{
            titles:32,
            subtitles:20,
            author:18,
            chapterTitle:24,
            h1:20,
            h2:18,
            h3:16,
            body:12,
        },
        spacing:{
            paragraph:200,
            paragraphAfter:100,
            chapterBefore:400,
            chapterAfter:300,
            headingBefore:300,
            headingAfter:150,
        },
    };
    //function to process markdown content and convert it to docx paragraphs
    const processMarkdown=(markdown)=>{
        const tokens=md.parse(markdown,{});
        const paragraphs=[];
        let inList=false;
        let ListType=null;
        let orderedCounter=1;
        for(let i=0;i<tokens.length;i++){
            const token=tokens[i];
            try {
                if(token.type==="heading_open"){
                    const level=parseInt(token.tag.substring(1),10);
                    const nextToken=tokens[i+1];
                    if (nextToken&&contentToken.type==="inline"){
                        let headingLevel;
                        let fontSize;
                        switch(level){
                            case 1:
                                headingLevel=HeadingLevel.HEADING_1;
                                fontSize=DOCK_STYLES.sizes.h1;
                                break;
                            case 2:
                                headingLevel=HeadingLevel.HEADING_2;
                                fontSize=DOCK_STYLES.sizes.h2;
                                break;
                                case 3:
                                headingLevel=HeadingLevel.HEADING_3;
                                fontSize=DOCK_STYLES.sizes.h3;
                                break;
                                default:
                                    headingLevel=HeadingLevel.HEADING_3;
                                    fontSize=DOCK_STYLES.sizes.h3;
                                    break;
                        }
                        paragraphs.push(
                            new Paragraph({
                                text:nextToken.content,
                                heading:headingLevel,
                                spacing:{
                                    before:DOCK_STYLES.spacing.headingBefore,
                                    after:DOCK_STYLES.spacing.headingAfter,
                                },
                                style:{
                                    font:DOCK_STYLES.fonts.heading,
                                    size:fontSize*2,//docx uses half points
                                },
                            })
                        );
                        i+=2;//skip the content token and the closing tag
                    }
                } else if(token.type==="paragraph_open"){
                    const nextToken=tokens[i+1];
                    if("nextToken&&nextToken.type==="inline" && nextToken.children){
                        const textRuns=processInlineTokens(contentToken.children);
                        if(textRuns.length>0){
                            paragraphs.push(
                                new Paragraph({
                                    children:textRuns,
                                    spacing:{
                                        before: inList ? 100 : DOCK_STYLES.spacing.paragraphBefore,
                                        after: inList ? 100 :DOCK_STYLES.spacing.paragraphAfter,
                                        line:360,
                                    },
                                    alignment:AlignmentType.JUSTIFIED,
                                })
                            );
                        }
                        i+=2;
                    } else if(token.type==="bullet_list_open"){
                        inList=true;
                        ListType="bullet";
                    } else if(token.type==="ordered_list_open"){
                        inList=false;
                        ListType="null";
                        // add spacing after list
                        paragraphs.push(new Paragraph({
                            text:"",
                            spacing:{after:100},
                        }))
                    }
                } else if(token.type==="ordered_List_open"){
                    inList=true;
                    ListType="ordered";
                    orderedCounter=1;
                } else if(token.type==="bullet_list_close"){
                    inList=false;
                    ListType=null;
                    orderedCounter=1;

                }
                paragraphs.push(new Paragraph({
                    text:"",
                    spacing:{after:100},
                }));
            }else if(token.type==="list_item_open"){
                const nextToken=tokens[i+1];
                if(nextToken&&nextToken.type==="paragraph_open"){
                    const inlineToken=tokens[i+2];
                    if(inlineToken&&inlineToken.type==="inline"&&inlineToken.children){
                        const textRuns=processInlineTokens(inlineToken.children);
                        let bulletText;
                        if(ListType==="bullet"){
                            bulletText="• ";
                        } else if(ListType==="ordered"){
                            bulletText=`${orderedCounter}. `;
                            orderedCounter++;
                        }
                        paragraphs.push(
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:bulletText,
                                        font:DOCK_STYLES.fonts.body,
                                    }),
                                    ...textRuns,
                                ],
                                spacing:{
                                    before:50,
                                    after:50,
                                },
                                indent:{
                                    left:720,
                                },
                            })
                        );
                        i+=4;
                    }
                }
            }else if(token.type==="blockquote_open"){
                //find the blockquote content
                const nextToken=tokens[i+1];
                if(nextToken&&nextToken.type==="paragraph_open"){
                    const inlineToken=tokens[i+2];
                    if(inlineToken&&inlineToken.type==="inline"){
                        paragraphs.push(
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:inlineToken.content,
                                        italics:true,
                                        color:"666666",
                                        font:DOCK_STYLES.fonts.body,
                                    }),
                                ],
                                spacing:{
                                    before:200,
                                    after:200,
                                },
                                indent:{
                                    left:720,
                                },
                                alignment:AlignmentType.justified,
                                border:{
                                    left:{
                                        color:"CCCCCC",
                                        space:1,
                                        style:"single",
                                        size:6,
                                    },
                                },
                            })
                        );
                        i+=4;
                    }
                }
            } else if(token.type==="code_block"||token.type==="fence"){
                paragraphs.push(
                    new Paragraph({
                        children:[
                            new TextRun({
                                text:token.content,
                                font:"Courier New",
                                size:20,
                                color:"333333",
                            }),
                        ],
                        spacing:{
                            before:200,
                            after:200,
                        },
                        shading:{
                            fill:"F5F5F5",
                        },
                    })
                );
            }else if(token.type==="hr"){
                paragraphs.push(
                    new Paragraph({
                        text:"",
                        border:{
                            bottom:{
                                color:"CCCCCC",
                                space:1,
                                style:"single",
                                size:6,
                            },
                        },
                        spacing:{
                            before:200,
                            after:200,
                        },
                    })
                );
            }
        }catch(tokenError){
            console.error("Error processing token:", token.type, tokenError);
            continue;
        }
    }
    return paragraphs;
};
//process inline tokens to create text runs with formatting
const processInlineTokens=(tokens)=>{
    const textRuns=[];
    let currentFormatting={
        bold:false,
        italics:false,
    };
    let textBuffer="";
    const flushBuffer=()=>{
        if(textBuffer.trim()){
            textRuns.push(
                new TextRun({
                    text:textBuffer,
                    bold:currentFormatting.bold,
                    italics:currentFormatting.italics,
                    font:DOCK_STYLES.fonts.body,
                    size:DOCK_STYLES.sizes.body*2,
                })
            );
            textBuffer="";
        }
    };
    children.forEach((child)=>{
        if(child.type==="strong_open"){
            flushText();
            currentFormatting.bold=true;
        } else if(child.type==="strong_close"){
            flushText();
            currentFormatting.bold=false;
        } else if(child.type==="em_open"){
            flushText();
            currentFormatting.italics=true;
        } else if(child.type==="em_close"){
            flushText();
            currentFormatting.italics=false;
        } else if(child.type==="text"){
            textBuffer+=child.content;
        }
    });
    flushBuffer();
    return textRuns;
}



                        
const exportAsDocuments = async (req, res) => {
    try {
        const book =await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({ message: "Book not found" });
        }
        if(book.userid.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const sections=[];
        //cover page with image if available
        const coverPage=[];
        if(book.coverImage&&!book.coverImage.includes("pravatar")){
            const imagepath=book.coverImage.substring(1);
            try {
                if(fs.existsSync(imagepath)){
                    const imageBuffer=fs.readFileSync(imagepath);
                    //add some top spacing
                    coverPage.push(
                        {
                            new Paragraph({
                            text:"",
                            spacing:{before:1000},
                        })
                    };
                    //add image centered on page
                    coverpage.push(
                        new paragraph({
                            children:[
                                new ImageRun({
                                    data:imageBuffer,
                                    transformation:{
                                        width:400,// width
                                        height:550,// height
                                    },
                                }),
                            ],
                            alignment:AlignmentType.CENTER,
                            spacing:{before:200,after:400},
                        })
                    );
                    //page brak after cover page
                    coverPage.push(
                        new Paragraph({
                            text:"",
                            pageBreakBefore:true,
                        })
                    );
                }
                } catch (imgerror) {
                    console.error(`Error processing cover image: ${imagepath}`, imgerror);
                }
        
            }
            sections.push(...coverPage);

        //add title and author to cover page
        const titlePage=[];
        //main title
        titlePage.push(
            new Paragraph({
                children:[
                    new TextRun({
                        text:book.title,
                        bold:true,
                        font:DOCK_STYLES.fonts.heading,
                        size:DOCK_STYLES.fonts.sizes.titles*2,
                        color:"1A202c",
                    }),
                ],
                alignment:AlignmentType.CENTER,
                spacing:{before:200,after:400},
                    }),
                },
        alignment:AlignmentType.CENTER,
       spacing:{before:200,after:400},
            })
        );
                //subtitle if exists
                if(book.subtitle&& book.subtitle.trim()){
                    titlePage.push(
                        new Paragraph({
                            children:[
                                new TextRun({
                                    text:book.subtitle,
                                    font:DOCK_STYLES.fonts.heading,
                                    size:DOCK_STYLES.fonts.sizes.subtitles*2,
                                    color:"4A5568",
                                }),
                            ],
                            alignment:AlignmentType.CENTER
                            spacing:{after:400},
                        })
                    );
                }
                //author name
                titlePage.push(
                    new Paragraph({
                        children:[
                            new TextRun({
                                text:'by ${book.author}',
                                font:DOCK_STYLES.fonts.heading,
                                size:DOCK_STYLES.fonts.sizes.author*2,
                                color:"2D3748",
                            }),
                        ],
                        alignment:AlignmentType.CENTER,
                        spacing:{after:200},
                    })
                );
                //decorative line
                titlePage.push(
                    new Paragraph({
                        text:"",
                        border:{
                            bottom:{
                                color:"4F46E5",
                                space:1,
                                Style:"single",
                                size:12,
                            },
                        },
                        alignment:AlignmentType.CENTER,
                        spacing:{before:400},
                    })
                );
                sections.push(...titlePage);
            
                //process    chapters
                book.chapters.forEach((chapter,index)=>{
                    try {
                        //page braek before each chapter except the first one
                        if(index>0){
                            sections.push(
                                new Paragraph({
                                    text:"",
                                    pageBreakBefore:true,
                                })
                            );
                        }
                        //chapter title
                        sections.push(
                            new Paragraph({
                                children:[
                                    new TextRun({
                                        text:chapter.title,
                                        bold:true,
                                        font:DOCK_STYLES.fonts.heading,
                                        size:DOCK_STYLES.fonts.sizes.chapterTitle*
                                        color:"1A202c",
                                    }),
                                ],
            
                                spacing:{before:DOCK_STYLES.spacing.chapterBefore,
                                after:DOCK_STYLES.spacing.chapterAfter
                            },
                            })
                        );
                        //chapter content
                        const contentParagraohs=processMarkdown(chapter.content||"");
                        sections.push(...contentParagraohs);
                    } catch (chapterError) {
                        console.error("Error processing chapter ${chapter.title}:", chapterError);
                    }
                });
                //create document
                const doc=new Document({
                    sections:[
                        {
                            properties:{
                                page: {
                                    margin:{
                                        top:1440,
                                        right:1440,
                                        bottom:1440,
                                        left:1440,
                                    },
                                },
                            },
                            children:sections,  
                            },
                        
                    ],
                });
                //generate document buffer
                const buffer=await Packer.toBuffer(doc);
                //send the document
                res.setHeader(
                    "Content-type",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                );
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx"`
                );
                res.setHeader("Content-Length", buffer.length);
                //send buffer as response
                res.send(buffer);
    }catch (error) {
        console.error("Error exporting book:", error);
        if(!res.headersSent){
        res.status(500).json({ 
            message: "Server error",
            error: error.message
        });
    }
}

};
//topography configuration for modern ebook style
const TYPOGRAPHY={
    fonts:{
        serif:"Times-Roman",
        serifBold:"Times-Bold",
        serifItalic:"Times-Italic",
        sans:"Helvetica",
        sansBold:"Helvetica-Bold",
        sansOblique:"Helvetica-Oblique",
    },
    sizes:{
        titles:28,
        author:16,
        chapterTitle:20,
        h1:18,
        h2:16,
        h3:14,
        body:11,
        caption:9,
    },
    spacing:{
        paragraphspacing:12,
        chapterSpacing:24,
        headingSpacing:{before:16,after:8},
        listSpacing:6,
    },
    colors:{
        text:"#333333",
        heading:"#1A1A1A",
        accent:"#4F46E5",
    },
};
const renderInlineTokens=(doc,tokens,options={})=>{
    if(!tokens||tokens.length===0){
        return;
    }
    const beseOptions={
        align:options.align||"justify",
        indent:options.indent||0,
        lineGap:options.lineGap||2,
    };
    let currentFont=TYPOGRAPHY.fonts.serif;
    let textBuffer="";

    const flushBuffer=()=>{
        if(textBuffer){
            doc.font(currentFont)
            .text(textBuffer,{
                ...baseOptions,
                continued:true,
            });
            textBuffer="";
        }
    };
    for(let i=0;i<tokens.length;i++){
        const token=tokens[i];

        if(token.type==="text"){
            textBuffer+=token.content;
        } else if(token.type==="strong_open"){
            flushBuffer();
            currentFont=TYPOGRAPHY.fonts.serifBold;
        } else if(token.type==="strong_close"){
            flushBuffer();
            currentFont=TYPOGRAPHY.fonts.serif;
        } else if(token.type==="em_open"){
            flushBuffer();
            currentFont=TYPOGRAPHY.fonts.serifItalic;
        }
            else if(token.type==="em_close"){
                flushBuffer();
                currentFont=TYPOGRAPHY.fonts.serif;
            }
            else if(token.type==="code_inline"){
                flushBuffer();
                doc.font("courier").text(token.content,{
                    ...baseOptions,
                    continued:true,
                });
                doc.font(currentFont);
            }
    }
    if(textBuffer){
        doc.font(currentFont).text(textBuffer,{
            ...baseOptions,
            continued:false,
        });
    }else{
        doc.text("",{
            continued:false,
        });
    }
};
const renderMarkdown=(doc,markdown)=>{
    if(!markdown||markdown.trim()==="")
        return;
    const tokens=md.parse(markdown,{});
    let inList=false;
    let listType=null;
    let orderedListCounter=1;

    for(let i=0;i<tokens.length;i++){
        const token=tokens[i];

        try {
                if(token.type==="heading_open"){
                    const level=parseInt(token.tag.substring(1),10);
                    let fontSize;

                    switch(level){
                        case 1:
                            fontSize=TYPOGRAPHY.sizes.h1;
                            break;
                        case 2:
                            fontSize=TYPOGRAPHY.sizes.h2;
                            break;
                        case 3:
                            fontSize=TYPOGRAPHY.sizes.h3;
                            break;
                        default:
                            fontSize=TYPOGRAPHY.sizes.h3;
                    
                    }
                    doc.moveDown
                    (TYPOGRAPHY.spacing.headingSpacing.before/ TYPOGRAPHY.sizes.body);
                    doc
                    .font(TYPOGRAPHY.fonts.sansBold)
                    .fontSize(fontSize)
                    .fillColor(TYPOGRAPHY.colors.heading);

                    if(i+1<tokens.length&&tokens[i+1].type==="inline"){
                        renderInlineTokens(doc,tokens[i+1].children,{
                            align:"left",
                            lineGap:0,
                        });
                        i++;
                    }
                    doc.moveDown(
                        TYPOGRAPHY.spacing.headingSpacing.after/TYPOGRAPHY.sizes.body);
                        if(i+1<tokens.length&&tokens[i+1].type==="heading_close"){
                            i++;
                        }
                } else if(token.type==="paragraph_open"){
                    doc
                    .font(TYPOGRAPHY.fonts.serif)
                    .fontSize(TYPOGRAPHY.sizes.body)
                    .fillColor(TYPOGRAPHY.colors.text);

                    if(i+1<tokens.length&&tokens[i+1].type==="inline"){
                        renderInlineTokens(doc,tokens[i+1].children,{
                            align:"justify",
                            lineGap:2,
                        });
                        i++;
                    }
                    if(!inList){
                        doc.moveDown(TYPOGRAPHY.spacing.paragraphSpacing/TYPOGRAPHY.sizes.body);

                    }
                    if(i+1<tokens.length&&tokens[i+1].type==="paragraph_close"){
                        i++;
                    }
                } else if(token.type==="bullet_list_open"){
                    inList=true;
                    listType="bullet";
                    doc.moveDown(TYPOGRAPHY.spacing.listSpacing/TYPOGRAPHY.sizes.body);
                } else if(token.type==="bullet_list_close"){
                    inList=false;
                    listType=null;
                    doc.moveDown(TYPOGRAPHY.spacing.listSpacing/TYPOGRAPHY.sizes.body);
                }
                else if(token.type==="ordered_list_open"){
                    inList=true;
                    listType="ordered";
                    orderedListCounter=1;
                    doc.moveDown(TYPOGRAPHY.spacing.listSpacing/TYPOGRAPHY.sizes.body);
                } else if(token.type==="ordered_list_close"){
                    inList=false;
                    listType=null;
                    orderedListCounter=1;
                    doc.moveDown(TYPOGRAPHY.spacing.listSpacing/TYPOGRAPHY.sizes.body);
                }
                else if(token.type==="list_item_open"){
                    let bullet="";
                    if(listType==="bullet"){
                        bullet="• ";
                    } else if(listType==="ordered"){
                        bullet=`${orderedListCounter}. `;
                        orderedListCounter++;
                    }
                    doc
                    .font(TYPOGRAPHY.fonts.serif)
                    .fontSize(TYPOGRAPHY.sizes.body)
                    .fillColor(TYPOGRAPHY.colors.text)

                    doc.text(bullet,{
                        indent:20,
                        continued:true,
                    });

                    for(let j=i+1;j<tokens.length;j++){
                        if(tokens[j].type==="inline"&&tokens[j].children){
                            renderInlineTokens(doc,tokens[j].children,{
                                align:"left",
                                lineGap:2,
                            });
                            break;
                        }
                        else if(tokens[j].type==="list_item_close"){
                            break;
                        }
                    }
                    doc.moveDown(TYPOGRAPHY.spacing.listSpacing/TYPOGRAPHY.sizes.body);
                }else if(token.type==="code_block"||token.type==="fence"){
                    doc.moveDown(TYPOGRAPHY.spacing.paragraphSpacing/TYPOGRAPHY.sizes.body);
                    doc
                    .font("Courier")
                    .fontSize(9)
                    .fillColor(TYPOGRAPHY.colors.text)
                    .text(token.content,{
                        indent:20,
                        align:"left",
                    });

                    doc.font(TYPOGRAPHY.fonts.serif)
                    .fontSize(TYPOGRAPHY.sizes.body);
                     doc.moveDown(TYPOGRAPHY.spacing.paragraphSpacing/TYPOGRAPHY.sizes.body);
                } else if(token.type==="hr"){
                    doc
                    .moveTo(doc.page.width-doc.page.margins.right, y)
                    .stroke{};
                    doc.moveDown();
                }
        } catch (renderError) {
            console.error("Error rendering token:", token.type, renderError);
            continue;
        }
    }
};
      


const exportAsPDF = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //create pdf with safe settings
        const doc = new PDFDocument({
            margin:72, top: 72,
            bottom: 72,
            left: 72,
            right: 72,
            bufferPages: true,
            autoFirstPage: true,
        });
        //set header before piping
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
        );
        doc.pipe(res);
        //cover page with image if available
        if (book.coverImage && !book.coverImage.includes("pravatar")) {
            const imagePath = book.coverImage.substring(1);
            try {
                if (fs.existsSync(imagePath)) {
                    const pageWidth = doc.page.width-doc.page.margins.left-doc.page.margins.right;
                    const pageHeight = doc.page.height-doc.page.margins.top-doc.page.margins.bottom;
                    doc.image(imagePath, doc.page.margins.left, doc.page.margins.top, {
                        fit: [pageWidth=0.8, pageHeight=0.8],
                        align: "center",
                        valign: "center",
                    });
                    doc.addPage();
                }
            } catch (imgError) {
                console.error(`Error processing cover image: ${imagePath}`, imgError);
            }
        }
        //title page
        doc
        .font(TYPOGRAPHY.fonts.sansBold)
        .fontSize(TYPOGRAPHY.sizes.titles)
        .fillColor(TYPOGRAPHY.colors.heading)
        .text(book.title, {
            align: "center",
        });

        doc.moveDown(2);
if (book.subtitle && book.subtitle.trim()) {
            doc
.font(TYPOGRAPHY.fonts.sans)
.fontSize(TYPOGRAPHY.sizes.h2)
.fillColor(TYPOGRAPHY.colors.text)
.text('by ${book.author}', {
    align: "center",
});
//process chapters
if (book.chapters && book.chapters.length > 0) {
    book.chapters.forEach((chapter, index) => {
        try {
            doc.addPage();
            //chapter title
            doc
.font(TYPOGRAPHY.fonts.sansBold)
.fontSize(TYPOGRAPHY.sizes.chapterTitle)
.fillColor(TYPOGRAPHY.colors.heading)
.text(chapter.title||`chapter ${index + 1}`, {
    align: "left",
});
            doc.moveDown(
                TYPOGRAPHY.spacing.chapterSpacing /TYPOGRAPHY.sizes.body

            );
            //chapter content
            if (chapter.content && chapter.content.trim()) {
                renderMarkdownToPDF(doc, chapter.content);
            }
        } catch (chapterError) {
            console.error("Error processing chapter ${index}:", chapterError);

        }
    });
}
//finalize pdf
doc.end();
}
catch (error) {
    console.error("Error exporting book as PDF:", error);
    if (!res.headersSent) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}
    };




module.exports = {
    exportAsDocuments,
};




                





                    










}