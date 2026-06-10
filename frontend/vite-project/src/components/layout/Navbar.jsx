import { useState,useEffect } from "react";
import{useAuth} from "../../context/AuthContext";
import porfileDropdown from "./ProfileDropdown";
import Menu,x,BookOpen,LogOut from "lucide-react";

const Navbar=()=>{
    const {user,logout,isAuthenticated}=useAuth();
    const [isOpen,setIsOpen]=useState(false);
    const [profileDropdownOpen,setProfileDropdownOpen]=useState(false);

    const navLinks=[
        {name:"features",href:"#features"},
        {name:"Testimonials",href:"#testimonials"},
    ];
//close dropdown when clicking outside
    useEffect(()=>{
        const handleClickOutside=()=>{
            if(profileDropdownOpen){
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener["click",handleClickOutside];
        return()=>{
            document.removeEventListener("click",handleClickOutside);
        };
    },[profileDropdownOpen]);

    return <header>
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className=" flex items-center justify-between h-16">
                {/* Logo and menu button for mobile view */}
                <a href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 bg-gradient-to-br from-viloet-400-to purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/50 group-hover:from-violet-500 group-hover:to-purple-600 transition-colors duration-300">
                    <BookOpen className=""/>
                    </div>
                    <span className="">
                        AI eBook Creator
                        </span>
                </a>
                {/*desktop nav links */}
                <nav className="">
                    <navLinks.map((link)=>(
                        <a 
                        key={link.name} 
                        href={link.href}
                        className=""
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
                {/* user profile and auth buttons */}
                <div className="">
                    {isAuthenticated ? (
                        <PorfileDropdown
                        isOpen={profileDropdownOpen}
                        onToggle={(e)=>
                            e.stopPropagation();
                            setProfileDropdownOpen(!profileDropdownOpen);
                        )}
                        avatar={user.avatar||""}
                        companyName={user?.name||""}
                        email={user?.email||""}
                        userrole={user?.role||""}
                        onLogout={()=>console.log("logout")}
                        />
                    ) : 
                    <>
                    <a
                    href="/login"
                    className="
                    >
                    Login
                    </a>
                    <a
                    href="/signup"
                    className=""
                    >
                        Get started
                    </a>
                    </>
                   )}
                   </div>
                   {/* Mobile menu button */}
                   <button
                   onClick={()=>setIsOpen(!isOpen)}
                     className=""
                     >
                        {isOpen ? <X className=""/> : <Menu className=""/>}
                    </button>
                    </div>
                </div>
    </header>
    };
    export default Navbar;

