
export const setCssVarOnBody = (varName: string, varValue: string) => {
    const root: any = document.querySelector(':root');
    if (root == null) return;
    root.style.setProperty(varName, varValue);
}

export const updateCustomStyleTag = (tagName: string, cssContent: string) => {
    const head = document.head || document.getElementsByTagName('head')[0];

    if (head == null) return;

    const exitingScriptTag = [...head.childNodes].find((cn: any) => cn.id === tagName);
    if (exitingScriptTag != null) {
        exitingScriptTag.remove();
    }

    const styleElem: any = document.createElement('style');

    styleElem.type = 'text/css';
    styleElem.id = tagName;
    if (styleElem.styleSheet) {
        // This is required for IE8 and below.
        styleElem.styleSheet.cssText = cssContent;
    } else {
        styleElem.appendChild(document.createTextNode(cssContent));
    }

    head.appendChild(styleElem);
}

export const scrollIdIntoView = (id: string) => {
    const elem = document.getElementById(id);
    if (elem == null) return;

    const yOffset = -75;

    setTimeout(() => {
        const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
    }, 250)
}

export const initSticky = (ids: Array<string>) => {

    window.onscroll = () => {
        for (const id of ids) {
            const elem = document.getElementById(id);
            if (elem == null) continue;

            const sticky = elem.offsetTop;

            if (window.pageYOffset > sticky) {
                elem.classList.add('sticky');
            } else {
                elem.classList.remove('sticky');
            }
        }
    };
}

export const preventDefault = (e: any) => e?.preventDefault?.();
export const noContextMenu = (e: any) => e?.preventDefault?.();