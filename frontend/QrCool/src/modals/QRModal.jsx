import { useContext, useRef, useState } from "react"
import { toPng } from "html-to-image";

// Components
import GenericModal from "./GenericModal";
import QRCode from "react-qr-code";

// Icons
import { FaRegClipboard } from "react-icons/fa6";

// Context
import { AppContext } from "../context/AppProvider"
import { ContentContext } from "../context/ContentProvider";

function QRModalContent({qrRef}){
    const [textColor, setTextColor] = useState("text-base");
    const [text, setText] = useState("Copy to clipboard");
    const [textSuccess, setTextSuccess] = useState(false);
    const { qrValue } = useContext(ContentContext);

    function onLinkBtnClick(){
        navigator.clipboard.writeText(qrValue?.qr);
        setText("Copied link to your clipboard");
        setTextColor('text-green-500');
        setTextSuccess(true);

        setTimeout(() => {
            setText("Copy to clipboard");
            setTextColor('text-base');
            setTextSuccess(false)
        }, [2500]);
    }

    return(
        <>
            <button onClick={onLinkBtnClick} type="button" className={`${textColor} font-bold nice-trans ${!textSuccess && "hover:text-blue-700"} flex items-center gap-3`}>
                <FaRegClipboard className="text-2xl"/> 
                <div>{text}</div>
            </button>
            {qrValue && <QRCode 
                className="size-full"
                ref={qrRef}
                value={qrValue?.qr}
                size={256}
            />}
        </>
    );
}

function QRModal() {
    const { showQrModal, setShowQrModal} = useContext(AppContext);
    const { qrValue } = useContext(ContentContext);

    const qrRef = useRef(null);

    async function onDownload(){
        if (!qrRef.current)
            return;
       
        const dataUrl = await toPng(qrRef.current, {
            quality: 1,
            width: qrRef.current.offsetWidth, // Use the container's width
            height: qrRef.current.offsetHeight, // Use the container's height,
            style: {
                margin: '0'
            }
        });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${qrValue?.entry.Name}-qr.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return <GenericModal 
        btnText="Download"
        setShow={setShowQrModal}
        show={showQrModal}
        title={`${qrValue?.qr}`}
        centerTitle
        onSubmit={onDownload}
        hideScroll
    >
        <QRModalContent qrRef={qrRef} />
    </GenericModal>
}

export default QRModal
