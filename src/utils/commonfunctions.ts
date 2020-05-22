export const formatNumber = (value: number) => {
    const numberFormatter = new Intl.NumberFormat('en-IN');
    return isNaN(value) ? '-' : numberFormatter.format(value);
};
