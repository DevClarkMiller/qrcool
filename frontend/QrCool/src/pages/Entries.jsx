import { useEffect, useContext, useMemo } from "react"

// Components
import { Tooltip } from "react-tooltip";
import { ClipLoader } from "react-spinners";

// Modals
import AddEntryModal from "../modals/AddEntryModal";
import AddEntryContentModal from "../modals/AddEntryContentModal";
import GenericModal from '../modals/GenericModal';
import QRModal from "../modals/QRModal";
import EntryReportModal from "../modals/EntryReportModal";
import EntryContentModal from "../modals/EntryContentModal";

// Hooks
import useEntryViewCount from '../hooks/content/useEntryViewCount';

// Icons
import { FaTrash, FaPlusCircle, FaEdit, FaQrcode, FaEye } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

// Context
import { ContentContext } from "../context/ContentProvider";
import { AppContext } from "../context/AppProvider";
import { AccountContext } from "../context/AccountProvider";
import { getEndpoint } from "../api";

const Entry = ({entry}) =>{
    const { entryController, entryContentController, setQrValue, setActiveEntry } = useContext(ContentContext);
    const { setShowQrModal, setShowEntryReportModal } = useContext(AppContext);
    const { account } = useContext(AccountContext);
    const onClickEnter = async () =>{ entryContentController.get(entry); }
    const onClickDelete = () => { entryController.delete(entry.Id); }

    const onClickReport = () =>{
        setShowEntryReportModal(true);
        setActiveEntry(entry);
    }

    const onClickQr = () =>{
        setShowQrModal(true);
        const qrVal = `${getEndpoint()}/${account.Username}/${entry.Name}`;
        setQrValue({qr: qrVal, entry: entry});
    } 

    const entryViewCount = useEntryViewCount(entry.Id, entryController);

    return(
        <li className="w-full flex items-center gap-3">
            <div className="entry text-left flex-grow text-3xl font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">{entry?.Name}</div>
            <button onClick={onClickQr} className={`icon text-light nice-trans hover:text-blue-700`}>
                <FaQrcode />
            </button>
            {
            <button onClick={onClickReport} className={`icon text-light nice-trans hover:text-blue-700`}>
                <TbReportAnalytics />
            </button>}
            <a className={`icon text-light nice-trans hover:text-blue-700`}
                data-tooltip-id={`entryViewCount${entry.Id}`}
                data-tooltip-place="top"
            >
                <FaEye />
            </a>
            <Tooltip id={`entryViewCount${entry.Id}`}>
                {entryViewCount}
            </Tooltip>
            <button onClick={onClickEnter} className={`icon text-light nice-trans hover:text-blue-700`}>
                <FaEdit />
            </button>
            <button onClick={onClickDelete} className={`icon text-light nice-trans hover:text-red-700`}>
                <FaTrash />
            </button>
        </li>
    );
};

const AddEntry = ({hasEntries}) =>{
    const {setShowAddEntryModal} = useContext(AppContext);

    function onClick(){
        setShowAddEntryModal(true);
    }

    return(
        <>
            {hasEntries ? 
                <li className="w-full flex items-center gap-3 border-b-2 pb-2">
                    <div className="entry text-left flex-grow text-3xl font-bold">Add New Entry</div>
                    <button onClick={onClick} className={`icon text-light nice-trans hover:text-blue-700`}>
                        <FaPlusCircle />
                    </button>
                </li> : 
                <button onClick={onClick} className="nice-trans hover:text-blue-500 text-2xl flex items-center gap-3">
                    <span>Add Your First Entry</span> 
                    <FaPlusCircle />
                </button>
            }
        </>
    );
}

const Entries = () => {
    const { entries, entryController, entriesLoading } = useContext(ContentContext);
    const { showEntryReportModal, setShowEntryReportModal } = useContext(AppContext);

    const hasEntries = useMemo(() => entries && entries?.length > 0, [entries]);

    useEffect(() =>{ 
        if (!entries || entries.length == 0) entryController.get(); 
    }, []);

    return (
        <div className="size-full h-fit col-flex-center justify-between pt-12 px-5">
            {/* <h3 className="mb-5 text-3xl font-bold">Your entries</h3> */}
            {entriesLoading ? <ClipLoader size={150} color="white"/> :
                <ul className="flex-grow nice-trans !h-fit w-full lg:w-1/2 col-flex-center justify-start gap-3">
                <AddEntry hasEntries={hasEntries} />
                { entries?.map((entry) =><Entry key={entry?.Name} entry={entry} />)}
                <AddEntryContentModal />
                <EntryContentModal />
                <AddEntryModal />
                <QRModal />
                <EntryReportModal show={showEntryReportModal} setShow={setShowEntryReportModal}/>
            </ul>
            }
        </div>
    );
}

export default Entries;