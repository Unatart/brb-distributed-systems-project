

export const statRoutes = (app, controller) => {
    // return 50 records if no queries provided, otherwise return by count, by service_name
    app.get("/stat",  controller.get);
};
