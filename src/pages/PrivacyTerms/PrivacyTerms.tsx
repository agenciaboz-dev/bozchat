import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"

interface PrivacyTermsProps {}

export const PrivacyTerms: React.FC<PrivacyTermsProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={backgroundStyle}>
            <Box sx={{ color: "secondary.main", flexDirection: "column", padding: "3vw", gap: "0.5vw" }}>
                <img src={"/wagazap.svg"} style={{ width: isMobile ? "25vw" : "10vw", alignSelf: "center" }} draggable={false} />
                <h1>Privacy Policy for Wagazap</h1>
                <p>
                    <strong>Effective Date:</strong> November 8. 2024
                </p>

                <p>
                    Welcome to Wagazap. This privacy policy ("Policy") helps you understand how Boz ("we", "us", "our") collects, uses, and protects
                    the information you provide when you visit and use wagazap.boz.app.br ("the Site").
                </p>

                <h2>What We Collect and How We Use It</h2>
                <p>When you register on our Site, we collect your:</p>
                <ul>
                    <li>Name</li>
                    <li>Email Address</li>
                </ul>
                <p>
                    These details are gathered through our registration form and are used solely for the purpose of enabling login functionality on
                    the Site.
                </p>

                <h2>How We Store and Protect Your Information</h2>
                <p>
                    Your personal information is stored in our secured database and is protected behind authentication measures designed to block
                    unauthorized access from outside of our API. While we strive to use commercially acceptable means to protect your personal
                    information, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
                </p>

                <h2>Sharing of Personal Information</h2>
                <p>
                    We do not share your personal information with third parties. All data you provide is kept strictly for internal use and to
                    facilitate your access to our Site.
                </p>

                <h2>Your Rights</h2>
                <p>
                    You can access, update, or delete your personal information at any time via your profile on our website. If you have any problems
                    managing your data, please contact us using the details below.
                </p>

                <h2>Contact Information</h2>
                <p>For any questions or concerns regarding this privacy policy, you can contact us at:</p>
                <p>
                    Email: <a href="mailto:fernando@agenciaboz.com.br">fernando@agenciaboz.com.br</a>
                    <br />
                    Phone: +55 41 99111-7713
                </p>

                <h2>Changes to This Privacy Policy</h2>
                <p>
                    We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will
                    take effect immediately upon their posting on the website. However, we will not notify users of any changes.
                </p>
            </Box>
        </Box>
    )
}
