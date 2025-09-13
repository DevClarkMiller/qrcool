import { AppContext } from "src/AppContext";
import Dao  from "./dao";

export default class ContentTypeDao extends Dao<typeof AppContext.DB.contentType>{
    public constructor(){ super(AppContext.DB.contentType); }
}