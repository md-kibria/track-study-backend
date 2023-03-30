const setCompletedBook = (book) => {
    // Completed chapters
    let done = 0;
    // all chapter count
    const chapters = book.chapters.length;
    // Loop of chapters
    book.chapters.forEach(chapter => {
        if(chapter.completed === 100) {
            // If chapter comleted increase done
            done += 1;
        }
    })

    // return completed book
    return Math.round((done*100)/chapters);
}


const setCompletedChapter = (chapter, init=0) => {
    // Completed milestones
    let done = init;
    // All milestone count
    const milestones = chapter.milestones.length;
    // Loop of milestones
    chapter.milestones.forEach(mlstn => {
        if(mlstn.isDone) {
            // If milestone completd increase done
            done += 1
        }
    })

    // return completed chapter
    return Math.round((done*100)/milestones)
}

module.exports = {
    setCompletedBook,
    setCompletedChapter
}