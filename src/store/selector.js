import { createSelector } from '@reduxjs/toolkit';

const selectDialog = createSelector(
    state => state.counter,
    counter => counter.value
);