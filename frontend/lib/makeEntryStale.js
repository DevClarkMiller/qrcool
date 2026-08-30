export default function makeEntryStale(entryId){
    try{
        let ents = localStorage.getItem('entries');
        if (!ents) return;
        ents = JSON.parse(ents);
        delete ents[entryId];
        localStorage.setItem('entries', JSON.stringify(ents));
    }catch(err){
        console.error(err);
    }
}