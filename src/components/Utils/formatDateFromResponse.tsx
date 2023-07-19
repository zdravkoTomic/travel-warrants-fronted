export const formatDateFromResponse = (dateString: string) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}.${month}.${year}`;
};