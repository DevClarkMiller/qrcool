import { useContext, useMemo } from "react";

// Components
import GenericModal from "./GenericModal";

// Context
import { AppContext } from "../context/AppProvider";
import { ContentContext } from "../context/ContentProvider";

// Icons
import { FaTrash, FaCheckCircle } from "react-icons/fa";

function EntryContentItem({item}){
    const { entryContentController } = useContext(ContentContext);

    const onClickActive = () =>{ 
        entryContentController.set(item);
    }

    const onClickDelete = () => {
        entryContentController.delete(item);
    }

    return(
        <li className="size-full flex items-center gap-3">
            <div className={`p-1 text-center bg-regular rounded entryContentItem size-full rounded-m text-xl font-bold text-white`}>{item.Content.Name}</div>
            <button type="button" onClick={onClickActive} className={`${item.IsActive ? "text-green-500" : "hover:text-blue-700"} text-2xl text-black nice-trans`}>
                <FaCheckCircle />
            </button>
            <button type="button" onClick={onClickDelete} className="text-2xl text-black nice-trans hover:text-red-700">
                <FaTrash />
            </button>
        </li>
    );
}

function EntryContentModal(){
    const { showModal, setShowModal, setShowEntryContentModal, setEntryContentModalType } = useContext(AppContext);
    const { entryContent } = useContext(ContentContext);

    const hasEC = useMemo(() => entryContent?.length > 0, [entryContent]);

    const onOpenAdd = () =>{
        setShowEntryContentModal(true);
        setShowModal(false);
        setEntryContentModalType('Add');
    }

    return(
        <GenericModal 
            btnText="Close (ESC)"
            title="Manage Entry Content"
            setShow={setShowModal}
            show={showModal}
            onSubmit={() => setShowModal(false)}
            hideScroll={!hasEC}
        >   
            <li className={`size-full ${hasEC ? "border-b-2 border-regular pb-2" : ""}`}><button type="button" onClick={onOpenAdd} className={`bg-sky rounded entryContentItem size-full rounded-m text-xl font-bold nice-trans hover:bg-blue-400 text-white`}>Add</button></li>
            { entryContent?.map ((item) => <EntryContentItem key={item?.Content.Name} item={item} setShowModal={setShowModal} />)}
        </GenericModal>
    );
}

export default EntryContentModal;