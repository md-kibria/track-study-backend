const { addDays } = require("date-fns");
const createMilestones = require("./createMilestones");

const createChapters = (chapters, time) => {
    // Chapter object with all property
    let finalChapters = chapters.map((chapter, index) => {
        return {
            name: chapter.name,
            pages: chapter.pages,
            time,
            // left: time,
            extra: 0,
            start: addDays(new Date(), index * time),
            end: addDays(new Date(), index * time + time - 1),
            note: "",
            completed: 0,
        };
    });

    // Add milestones to the chapter
    finalChapters = finalChapters.map((chapter) => ({
        ...chapter,
        milestones: createMilestones(chapter),
    }));

    // return the chapter
    return finalChapters;
};

module.exports = createChapters;
