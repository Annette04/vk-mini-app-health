import bridge from '@vkontakte/vk-bridge';

export const getFromCloud = async (key) => {
    try {
        const response = await bridge.send('VKWebAppStorageGet', {
            keys: [key]
        });
        if (response.keys && response.keys.length > 0) {
            return JSON.parse(response.keys[0].value);
        }
        return null;
    } catch (error) {
        console.error('Error getting data from VK Cloud:', error);
        return null;
    }
};

export const setToCloud = async (key, value) => {
    try {
        await bridge.send('VKWebAppStorageSet', {
            key,
            value: JSON.stringify(value)
        });
        return true;
    } catch (error) {
        console.error('Error saving data to VK Cloud:', error);
        return false;
    }
};