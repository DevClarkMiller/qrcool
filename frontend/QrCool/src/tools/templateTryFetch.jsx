import api from "../api";

// export const tryFetch = () =>{
//     try{
//         // First post the content, then post the entryContent
//         let response = await api.post('/api/entryContent/add', entryContentRed?.EntryContent, { withCredentials: true });

//         response = await api.post('/api/content');
//     }catch(err){
//     if (err.response){
//         setHeaderStatus("text-red-500", err.response.data, 2500);
//     }
// }