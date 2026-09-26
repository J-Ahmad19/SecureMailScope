def identify_protocol(port: int) -> str:
    if port in [25, 465, 587]:
        return "SMTP"
    elif port in [143, 993]:
        return "IMAP"
    elif port in [110, 995]:
        return "POP3"
    return "UNKNOWN"
