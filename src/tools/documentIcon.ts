const icons: { [key: string]: string } = {
    //apk_file type
    apk: "/icones-documentos-washima/icon-apk.svg",

    //certificate_file type
    pfx: "/icones-documentos-washima/icon-certificate.svg",
    p12: "/icones-documentos-washima/icon-certificate.svg",
    pks12: "/icones-documentos-washima/icon-certificate.svg",

    //doc_file type
    doc: "/icones-documentos-washima/icon-doc.svg",
    docx: "/icones-documentos-washima/icon-doc.svg",

    //pdf_file type
    pdf: "/icones-documentos-washima/icon-pdf.svg",

    //script_file type
    sh: "/icones-documentos-washima/icon-script.svg",
    bat: "/icones-documentos-washima/icon-script.svg",
    ps1: "/icones-documentos-washima/icon-script.svg",

    //sheet_file type
    xls: "/icones-documentos-washima/icon-sheet.svg",
    xlsx: "/icones-documentos-washima/icon-sheet.svg",

    //slide_file type
    ppt: "/icones-documentos-washima/icon-slide.svg",
    pptx: "/icones-documentos-washima/icon-slide.svg",

    //zip_file type
    zip: "/icones-documentos-washima/icon-zip.svg",
    rar: "/icones-documentos-washima/icon-zip.svg",
}

export const documentIcon = (ext: string | undefined): string => {
    if (ext) return icons[ext]
    else return "/icones-documentos-washima/icon-generic.svg"
}
