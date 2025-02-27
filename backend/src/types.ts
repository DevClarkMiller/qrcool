export type Location = {
    Longitude: number;
    Latitude: number;
};

export type Place = {
    Country: string;
    State: string;
    City: string;
}

export type LocationPlace = {
    Location: Location;
    Place: Place;
}