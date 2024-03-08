export type StatusType = {
    name: string
}

export type BatchDataType = {
    id: string,
    batch_no: string,
    product_name: string,
    packing: string,
    expiry_date: string,
    quantity: number,
    discount: number,
    tax: number,
    rate: number,
    status: string,
    isNew?: boolean
}