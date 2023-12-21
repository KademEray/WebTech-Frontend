import { createStore } from 'vuex'

export default createStore({
    state: {
        selectedShape: 'rectangle',
        savedSkins: [],  // Liste der gespeicherten Skins
        selectedColor: '#000000',  // Standardfarbe
        currentSkin: null,  // Aktuell ausgewählter Skin
        username: null,  // Initial auf null setzen
        token: null,
        points: 0,
        userId: null,
    },
    mutations: {
        setSelectedShape(state, shape) {
            state.selectedShape = shape;
        },
        setSelectedColor(state, color) {
            state.selectedColor = color;
        },
        saveSkin(state, skin) {
            state.savedSkins.push(skin);
        },
        deleteSkin(state, index) {
            state.savedSkins.splice(index, 1);
        },
        setCurrentSkin(state, skin) {
            state.currentSkin = skin;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.username = null;
            state.token = null;
        },
        setPoints(state, points) {
            state.points = points;
        },
        setUserId(state, userId) {
            state.userId = userId;
        },
        resetState(state) {
            state.savedSkins = [];
            state.currentSkin = null;
            state.selectedShape = 'rectangle';
            state.selectedColor = '#000000';
        },
        setSkins(state, skins) {
            state.savedSkins = skins;
        },
        updateSkin(state, payload) {
            const { index, updatedSkin } = payload;
            state.savedSkins[index] = updatedSkin;
        },
        loadSkin(index) {
            const skin = this.savedSkins[index];
            this.selectedColor = skin.color;
            this.selectedShape = skin.shape;
            this.$store.commit('setCurrentSkin', skin);
            this.updateSkin();
        },
        setSelectedSkin(state, skin) {
            state.selectedSkin = skin;
        },

    }
})
