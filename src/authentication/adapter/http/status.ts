export interface Status{
    code: Code,
    msg: string
}

export type Code = 'SUCCESS' | 'ERROR'