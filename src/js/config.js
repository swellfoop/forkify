const keys = [
    '318025a5ef17aff86684cd84ead721a3',
    'd2d0b4e62d7d4042d34401e95753447a',
    'c5f9bbfd1d77db1619426e0d8bd4d00e'
]

export const apiUrl = 'https://www.food2fork.com/api/';
export const key = keys[2];
export const errorMessage = msg => {
    if (msg === 'key') {
        return 'You have likely exceeded your API calls for the day. Try changing the API key in config.js.'
    } else if (msg === 'search') {
        return 'An error occured during the search.'
    } else if (msg === 'recipe') {
        return 'Could not process this recipe :c'
    };
    return 'Oops! Something went wrong! D:';
};