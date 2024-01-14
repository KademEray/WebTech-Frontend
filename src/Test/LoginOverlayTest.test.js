import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import LoginOverlay from '../component/LoginOverlay.vue'; // Pfad zur LoginOverlay-Komponente anpassen
import Highscore from '../component/Highscore.js'; // Pfad anpassen

// Mock-Implementierungen
jest.mock('../component/Highscore.js');

// Mock für localStorage und fetch
global.localStorage = {
    setItem: jest.fn(),
    removeItem: jest.fn()
};

global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
}));

describe('LoginOverlay.vue', () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                username: null,
                token: null,
                highscores: [],
                // Weitere State-Elemente
            },
            mutations: {
                setUsername: jest.fn(),
                setToken: jest.fn(),
                logout: jest.fn(),
                setHighscores: jest.fn(),
                // Weitere Mutationen
            },
            actions: {
                fetchHighscores: jest.fn()
            }
        });

        Highscore.mockImplementation(() => ({
            fetchHighscores: jest.fn(() => Promise.resolve([]))
        }));
    });

    test('renders login form when showLogin is true', () => {
        const wrapper = shallowMount(LoginOverlay, {
            global: {
                plugins: [store]
            },
            data() {
                return {
                    showLogin: true
                };
            }
        });
        expect(wrapper.find('.titellogin').exists()).toBe(true);
    });

    test('renders registration form when showLogin is false', () => {
        const wrapper = shallowMount(LoginOverlay, {
            global: {
                plugins: [store]
            },
            data() {
                return {
                    showLogin: false
                };
            }
        });
        expect(wrapper.find('.titel_sign_in').exists()).toBe(true);
    });

    test('toggles view on toggle button click', async () => {
        const wrapper = shallowMount(LoginOverlay, {
            global:     { plugins: [store] }
        });
        await wrapper.find('.toggle-button').trigger('click');
        expect(wrapper.vm.showLogin).toBe(false);
        await wrapper.find('.toggle-button').trigger('click');
        expect(wrapper.vm.showLogin).toBe(true);
    });

    test('playAsGuest sets isAuthenticated to true and emits authenticated', async () => {
        const wrapper = shallowMount(LoginOverlay, {
            global: { plugins: [store] }
        });
        await wrapper.vm.playAsGuest();
        expect(wrapper.vm.isAuthenticated).toBe(true);
        expect(wrapper.emitted().authenticated).toBeTruthy();
    });

    test('register with valid data', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        })); const wrapper = shallowMount(LoginOverlay, {
            global: { plugins: [store] },
            data() {
                return {
                    registerData: { username: 'testuser', password: 'Test@1234' }
                };
            }
        });
        await wrapper.vm.register();
        expect(wrapper.vm.successMessage).toBe('Registration successful. Please log in.');
    });
    afterEach(() => {
        fetch.mockClear();
    });
});