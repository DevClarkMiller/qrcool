import { useContext, useRef, useState } from "react"

// Components
import GenericModal from "./GenericModal";
import { QRCode } from "react-qrcode-logo";
import { Tooltip } from "react-tooltip";

// Icons
import { FaRegClipboard, FaImage } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";

// Context
import { AppContext } from "../context/AppProvider"
import { ContentContext } from "../context/ContentProvider";

function ColorController({color, setColor, label="", tooltip="tooltip"}){
    const colorRef = useRef();

    function colorClick(){
        colorRef.current.click();
    }

    return(
        <button onClick={colorClick} data-tooltip-id={`color-${label}`}  type="button" className="flex items-center gap-2 relative">
            <label className="text-light font-bold text-xl cursor-pointer">{label}</label>
            <div style={{color: color}} className="text-3xl">
                <IoIosColorPalette />
                <input value={color} ref={colorRef} onChange={e => setColor(e.target.value)} type="color" className="absolute inset-0 w-full opacity-0"/>
                </div>
            <Tooltip id={`color-${label}`}>
                {tooltip}
            </Tooltip>
        </button>
    );
}

function QRModalContent({qrRef}){
    const [textColor, setTextColor] = useState("text-base");
    const [text, setText] = useState("Copy to clipboard");
    const [textSuccess, setTextSuccess] = useState(false);

    const iconRef = useRef();

    const [bgColor, setBgColor] = useState("#FFFFFF");
    const [fgColor, setFgColor] = useState("#000000");
    const [icon, setIcon] = useState(null);

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

    function iconClick(){ iconRef.current.click(); }

    const handleFileChange = e =>{
        if (!e.target.files)
            return;

        const file = e.target.files[0];
        if (!file)
            return;

        const reader = new FileReader();
        reader.onload = () =>{
            setIcon(reader.result);
        };

        reader.readAsDataURL(file);
    }

    function onTrash(){ setIcon(null); }

    return(
        <>
            <button onClick={onLinkBtnClick} type="button" className={`${textColor} font-bold nice-trans ${!textSuccess && "hover:text-blue-700"} flex items-center gap-3`}>
                <FaRegClipboard className="text-2xl"/> 
                <div>{text}</div>
            </button>
            <div className="flex gap-3 rounded py-1 px-2 bg-regular text-light">
                <div className="text-xl flex items-center gap-3">
                    <label className="font-bold hover:cursor-pointer">Icon</label>
                    {icon ? <button onClick={onTrash} type="button" className="nice-trans text-red-500 hover:text-red-700"><FaTrash /></button> :
                    <button onClick={iconClick}  type="button"><FaImage className="nice-trans text-xl hover:text-blue-500" /></button>}
                    <input accept="image/png" onChange={handleFileChange} ref={iconRef} className="hidden" type="file"/>
                </div>
                <ColorController tooltip="Foreground" color={fgColor} setColor={setFgColor} label="FG"/>
                <ColorController tooltip="Background" color={bgColor} setColor={setBgColor} label="BG"/>
            </div>
            {qrValue && <QRCode 
                fgColor={fgColor}
                bgColor={bgColor}
                className="size-full"
                ref={qrRef}
                value={qrValue?.qr}
                size={160}

                logoImage={icon}
                logoWidth={80}
                logoHeight={80}
                ecLevel="H"
                logoOpacity={1}
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

        qrRef.current.download("png", `${qrValue?.entry.Name}-qr`);
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
