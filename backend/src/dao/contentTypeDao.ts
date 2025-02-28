import Dao  from "./dao";
import { db } from "../index";

export default class ContentTypeDao extends Dao{
    public constructor(){ super(db.contentType); }
}