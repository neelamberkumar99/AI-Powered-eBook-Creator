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
                    const contentToken=tokens[i+1];
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
                    const contentToken=tokens[i+1];
                    if("nextToken&&contentToken.type==="inline" && nextToken.children){
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
                } else if(token.type==="bullet_list_close"){
                    inList=true;
                    ListType="ordered";
                }
DOCK_STYLES.spacing.paragraphbefore,

                        const textRuns=[];

                        
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
        if(book.coverImage&&!book.coverImage.includes("pravatar")){
            const imagepath=book.coverImage.substring(1);
            try {
                if(fs.existsSync(imagepath)){
                    const imageBuffer=fs.readFileSync(imagepath);
                    //add some top spacing
                    coverPage.push(
                        {
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
                    console.error("Error processing cover image:", imgerror);
                }
        }
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
                    })
                };
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
                        spacing:{before:400},
                    })
                );
                sections.push(...coverPage,...titlePage);
                //add chapters
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
                                alignment:AlignmentType.CENTER,
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
                        },
                    ],
                });
                //generate buffer
                const buffer=await Packer.toBuffer(doc);
                //set response headers for download
                res.setHeader[
                    "Content-type",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx"`
                );
                res.setHeader("Content-Length", buffer.length);
                //send buffer as response
                res.send(buffer);
    } catch (error) {
        console.error("Error exporting book:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message
        });
    }
}

};



                





                    










}