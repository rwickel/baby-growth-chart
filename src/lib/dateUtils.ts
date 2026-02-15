import { Language } from '@/types/baby';
import { enUS, es, fr, de } from 'date-fns/locale';
import { format } from 'date-fns';

export const getDateLocale = (language: Language) => {
    switch (language) {
        case 'es':
            return es;
        case 'fr':
            return fr;
        case 'de':
            return de;
        default:
            return enUS;
    }
};

export const formatDate = (date: Date | number, formatStr: string, language: Language) => {
    return format(date, formatStr, { locale: getDateLocale(language) });
};
