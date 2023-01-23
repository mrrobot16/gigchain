import fs from "fs";

export function writeJSONFile(filename: string, data: any): void {
    data = JSON.stringify(data, null, 2)    
    fs.writeFileSync(
        filename, 
        data, 
        console.log("File has been created") as any
    )
}