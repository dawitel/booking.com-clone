const Footer = () => {
    return ( 
        <div className="bg-blue-800 pt-5 pb-6">
            <div className="container mx-auto flex justify-between items-center">
                <span className="text-3xl text-white font-bold tracking-tight">
                    Booking.com
                </span>
                <span className="text-white font-bold tracking-tight flex gap-4">
                    <p className="cursor-pointer hover:text-green-300">Privacy Policy</p>
                    <p className="cursor-pointer hover:text-green-300">Terms Of service</p>
                    <p className="cursor-pointer hover:text-green-300">Contact us</p>
                    <p className="cursor-pointer">English</p>
                </span>
            </div>
        </div>
     );
}
 
export default Footer;