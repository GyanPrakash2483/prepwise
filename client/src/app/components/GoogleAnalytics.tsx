import Script from "next/script"

export function GoogleAnalytics() {
    return (
        <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FEXYTW7T07" />
            <Script id='gtm-init'>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-FEXYTW7T07');
                `}
            </Script>
        </>
    )
}