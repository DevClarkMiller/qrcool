const GenericModal = ({
    children,
    show, 
    setShow, 
    onSubmit, 
    title, 
    btnText, 
    onClose, 
    maxHeight='max-h-72', 
    centerTitle = false,
    titleColor = 'text-light',
    hideScroll = false,
    hideFooter = false
}) => {
    // Hides modal
    function onModalClose(){
        if (setShow)
            setShow(false);
        if (onClose)
            onClose();
    }

    function submit(e){
        e.preventDefault();

        if (onSubmit)
            onSubmit(e);

        if (setShow)
            setShow(false);
    }

    return (
        <div id="modal" className={`${show ? "block" : "hidden"} fixed z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 modal flex items-center justify-center`}>
            <form onSubmit={submit} className="relative shadow-xl rounded-md bg-light max-w-md w-full">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center bg-regular text-white text-xl rounded-t-md px-4 py-2">
                    <h3 className={`font-semibold w-full ${titleColor} ${centerTitle && "text-center"} overflow-hidden overflow-ellipsis whitespace-nowrap`}>{title}</h3>
                    <button type="button" onClick={onModalClose}>x</button>
                </div>

                {/* <!-- Modal body --> */}
                <ul className={`${maxHeight} ${!hideScroll && "overflow-y-scroll"} p-4 gap-3 col-flex-center`}>
                    {children}
                </ul>

                {/* <!-- Modal footer --> */}
                {!hideFooter && <div className={`px-4 py-2 flex justify-center items-center space-x-4 ${children ? "border-t border-t-gray-500" : ""}`}>
                    <button className="bg-regular text-light px-4 py-2 rounded-md hover:bg-blue-700 transition" type="submit">{btnText}</button>
                </div>}
            </form>
        </div>
    );
}

export default GenericModal