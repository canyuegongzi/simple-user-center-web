import * as config from '@/config';
console.log(config);
export const global = {
    data() {
        return {
            globalConfig: {...config},
        };
    },
};

