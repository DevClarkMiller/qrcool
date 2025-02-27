import { Location, LocationPlace, Place } from "src/types";

export default class CoordsTranslator{
    private key: string;

    constructor(key: string){
        this.key = key;
    }

    async processOne(location: Location, key?: string): Promise<LocationPlace | null>{
        try{
            // If key isn't provided, use the default
            if (!key)
                key = this.key;

            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${location.Latitude}&lon=${location.Longitude}&format=json&apiKey=${key}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            
            const data: any = await response.json();
            const result: any = data.results[0];
            return {
                Location: location,
                Place: {
                    City: result.city,
                    Country: result.country,
                    State: result.state
                }
            };
        }catch(err: any){
            console.error(err);
            return null;
        }
    }

    /* Fn: processMany()
    *  Brief: Does a request for multiple locations, then returns the code to the job
    */
    async processMany(locations: Location[], key?: string): Promise<LocationPlace[] | null>{
        try{
            // If key isn't provided, use the default
            if (!key)
                key = this.key;

            let url: string = `https://api.geoapify.com/v1/batch/geocode/reverse?&apiKey=${key}`;
            let response = await fetch(url, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                    // Maps the locations into the correct format
                body: JSON.stringify(locations.map(location => [location.Longitude, location.Latitude]))
            });


            // Return the url for the job, this will be handled by the queue service
            let data: any = await response.json();
            return data.url
        }catch(err: any){
            console.error(err);
            return null;
        }
    }
}

/* Interface: ResultBehavior
*  Allows for custom behavior with the queue
*/
interface ResultBehavior{
    /* Fn: process()
    *  Brief: Processes the results
    */
    process(result: any[]);
}

abstract class EmailResultBehavior implements ResultBehavior{
    // Make derived handle this
    abstract process(result: any[]);

    email(){
        
    }
}

class EmailPDFResultBehavior implements ResultBehavior{
    process(result: any[]) {
        throw new Error("Method not implemented.");
    }
}

class EmailJSONBehavior implements ResultBehavior{
    process(result: any[]) {
        throw new Error("Method not implemented.");
    }
}

/* Class: CoordsTranslatorQueue
*  Brief: Adds translation jobs into a queue, then uses the behavior to act upon the results
*/

class QueueItem{
    public url: string;
    constructor(url: string) { this.url = url; }
}

class EmailQueueItem extends QueueItem{
    public email: string;
    constructor(url: string, email: string ){
        super(url);
        this.email = email;
    }
}

class CoordsTranslatorQueue{
    private coordsTranslator: CoordsTranslator;
    private queue: string[]; // Queue of the urls
    private running: boolean = false;

    public constructor(key: string){
        this.coordsTranslator = new CoordsTranslator(key);
        this.queue = [];
    }

    private top(): string{ return this.queue[0]; }
    private pop(): void { this.queue.shift(); }
    
    /*!Pushes response url + potentially an email too*/
    private pushJob(url: string, email?: string): void { 

    } 

    public push(locations: Location[]){

    }

    /* Fn: checkQueueWithDelay
    *  Brief: Checks the top of the queue with a delay
    */
    private async processTop(){
        const top = this.top();
    } 

    public async start(): Promise<void>{
        if (this.running) return;
        this.running = true;
        console.log("Coords Translator Queue Started");
        
        while (this.running){
            // Check if queue has items
            if (this.queue.length !== 0){
                await this.processTop();
            }
        }
    }

    public stop(): void{
        this.running = false;
    }
}