const { addDays } = require("date-fns");

const createMilestones = (chapter) => {
    // Extra chapter time
    let extraMileTime = 1;

    // if(chapter.time < 3) {
    //     extraMileTime = 1;
    // }

    // If chapter time is 1 day
    if (chapter.time === 1) {
        // No need the extra milestone
        extraMileTime = 0;
    }

    // Init the milestones
    let milestones = Array(Math.ceil(chapter.time - extraMileTime));

    // Update milestones with proper data
    for (let i = 0; i < milestones.length; i++) {
        milestones[i] = {
            name: `Milestone ${i + 1}`,
            pages: Math.floor(chapter.pages / (chapter.time - extraMileTime)),
            sPage: (Math.floor(chapter.pages / (chapter.time - extraMileTime))*i)+1,
            ePage: Math.floor(chapter.pages / (chapter.time - extraMileTime))*(i+1),
            time: 1,
            extra: 0,
            date: addDays(new Date(chapter.start), i),
            note: "",
            isDone: false,
            type: "MILESTONE",
        };
    }

    // If extra milestone has a value
    if (extraMileTime) {
        // Add extra milestone
        milestones.push({
            name: `Extra`,
            time: extraMileTime,
            extra: 0,
            date: addDays(new Date(chapter.start), milestones.length),
            note: "",
            isDone: false,
            type: "EXTRA",
        });
    }

    // return milestones
    return milestones;
};

module.exports = createMilestones;
