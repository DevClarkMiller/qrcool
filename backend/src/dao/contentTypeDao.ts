import Dao  from "./dao.js";
import { db } from "../index.js";

export default class ContentTypeDao extends Dao{
    public constructor(){ super(db.contentType); }
}