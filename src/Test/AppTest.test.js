import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue'; // Pfad anpassen

describe('App.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(App, {
            global: {
                mocks: {
                    $store: {
                        commit: jest.fn(),
                    },
                },
            },
        });
    });

    it('initialisiert mit korrekten Daten', () => {
        expect(wrapper.vm.isLoggedIn).toBe(false);
        expect(wrapper.vm.isAuthenticated).toBe(false);
        expect(wrapper.vm.isMuted).toBe(false);
    });

    it('schaltet den Mute-Status um', async () => {
        wrapper.vm.toggleMute();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isMuted).toBe(true);
    });

    it('setzt den Authentifizierungsstatus korrekt', async () => {
        wrapper.vm.handleAuthenticated();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isAuthenticated).toBe(true);
    });

    it('zeigt das LoginOverlay, wenn der Benutzer nicht authentifiziert ist', () => {
        expect(wrapper.findComponent({ name: 'LoginOverlay' }).exists()).toBe(true);
        expect(wrapper.find('.main-container').exists()).toBe(false);
    });

    it('zeigt den Hauptinhalt, wenn der Benutzer authentifiziert ist', async () => {
        wrapper.vm.isAuthenticated = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent({ name: 'LoginOverlay' }).exists()).toBe(false);
        expect(wrapper.find('.main-container').exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'SnakeGame' }).props('isMuted')).toBe(wrapper.vm.isMuted);
    });
});
