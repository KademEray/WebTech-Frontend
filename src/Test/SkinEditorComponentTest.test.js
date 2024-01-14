import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import SkinEditorComponent from '../component/SkinEditorComponent.vue'; // Pfad zur SkinEditorComponent anpassen


global.console.error = jest.fn();

describe('SkinEditorComponent', () => {
    let store;
    let actions;
    let mutations;
    let state;

    beforeEach(() => {
        state = {
            username: 'testUser',
            savedSkins: [],
            selectedColor: '#000000',
            selectedShape: 'rectangle',
            // weitere Zustände
        };

        mutations = {
            setCurrentSkin: jest.fn(),
            saveSkin: jest.fn(),
            deleteSkin: jest.fn(),
            updateSkin: jest.fn(),
            setSkins: jest.fn(),
            // weitere Mutationen
        };

        actions = {
            fetchUserSkins: jest.fn(),
            // weitere Aktionen
        };

        store = createStore({
            state,
            mutations,
            actions
        });
    });

    test('renders correctly', () => {
        const wrapper = shallowMount(SkinEditorComponent, {
            global: {
                plugins: [store]
            }
        });
        expect(wrapper.find('.skin-editor').exists()).toBe(true);
        expect(wrapper.find('.title').text()).toBe('Skin Editor');
    });

    test('updates selected color on input change', async () => {
        const wrapper = shallowMount(SkinEditorComponent, {
            global: {
                plugins: [store]
            }
        });
        const colorInput = wrapper.find('#color');
        await colorInput.setValue('#ff0000');
        expect(wrapper.vm.selectedColor).toBe('#ff0000');
    });

    test('updates selected shape on selection change', async () => {
        const wrapper = shallowMount(SkinEditorComponent, {
            global: {
                plugins: [store]
            }
        });
        const shapeSelect = wrapper.find('#shape');
        await shapeSelect.setValue('circle');
        expect(wrapper.vm.selectedShape).toBe('circle');
    });

    test('calls saveCurrentSkinToDB method on button click', async () => {
        const saveMethod = jest.spyOn(SkinEditorComponent.methods, 'saveCurrentSkinToDB');
        const wrapper = shallowMount(SkinEditorComponent, {
            global: {
                plugins: [store]
            }
        });
        await wrapper.find('.save-button').trigger('click');
        expect(saveMethod).toHaveBeenCalled();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});