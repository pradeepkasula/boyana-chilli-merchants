export const formatCurrency = (value) => {
  if (value == null) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 2,
  }).format(value);
};

export const formatWeight = (value) => {
  if (value == null) return '-';
  return `${parseFloat(value).toFixed(3)} kg`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN');
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-IN');
};
