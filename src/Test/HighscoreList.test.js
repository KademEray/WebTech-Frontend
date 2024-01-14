import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import HighscoreList from '../component/HighscoreList.vue'; // Pfad zur Highscore-Komponente anpassen

describe('HighscoreList.vue', () => {
    let actions;
    let state;
    let store;

    beforeEach(() => {
        state = {
            highscores: [{ id: 1, username: 'Alice', points: 100 }], // Stellen Sie sicher, dass der State-Name korrekt ist
            username: 'Alice'
        };

        actions = {
            fetchHighscores: jest.fn()
        };

        store = new Vuex.Store({
            state,
            actions
        });
    });

    const createWrapper = () => shallowMount(HighscoreList, {
        global: {
            plugins: [store]
        }
    });

    test('should render highscores', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('.Highscore-container').exists()).toBe(true);
        expect(wrapper.find('.titel').text()).toBe('Highscores');
        expect(wrapper.findAll('.Highscore-list li').length).toEqual(state.highscores.length);
    });

    test('should call fetchHighscores on mounted', () => {
        createWrapper();
        expect(actions.fetchHighscores).toHaveBeenCalled();
    });

    test('isCurrentUser method returns true for current user', () => {
        const wrapper = createWrapper();
        expect(wrapper.vm.isCurrentUser('Alice')).toBe(true);
    });

    test('isCurrentUser method returns false for non-current user', () => {
        const wrapper = createWrapper();
        expect(wrapper.vm.isCurrentUser('Bob')).toBe(false);
    });
});
