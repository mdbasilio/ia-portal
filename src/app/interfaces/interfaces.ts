export interface RequestHablante {
    script:     Script;
    source_url: string;
    driver_url: string;
}

export interface Script {
    type:      string;
    provider:  Provider;
    subtitles: boolean;
    input:     string;
}

export interface Provider {
    type:     string;
    voice_id: string;
}
