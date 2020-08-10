export const validateTitle = (title) => {
    if(title){
        if(title.length < 5) {
            return 'Minimum 5 characters';
        }
        return null;
    } else {
        return 'Mandatory field';
    }
}