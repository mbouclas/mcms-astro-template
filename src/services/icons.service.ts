export class IconService {
    static iconMap = [
        {
            name: 'roof',
            svg: `<svg xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
            %class% width="32" height="32"
            preserveAspectRatio="xMidYMid meet" viewBox="0 0 48 48">
           <path fill="none" stroke="currentColor" stroke-linecap="round"
                 stroke-linejoin="round"
                 d="M7 7h17v17H7zm17 0h17v17H24zM7 24h17v17H7zm19.8 2.8h17v17h-17z"></path>
       </svg>`
        },
        {
            name: 'info',
            svg: 'sad'
        },
    ];

    static defaultIcon = {
        name: 'roof',
        svg: 'sad'
    }

    find(name: string, classes = 'flex-shrink-0 h-6 w-6 text-primary') {
        const found = IconService.iconMap.find(item => item.name === name);
        const svg = (found) ? found : IconService.defaultIcon;
        svg.svg.replace('%class%', classes);
        return svg;
    }
}