module.exports=(s,D)=>s.define('MonitoringEvent',{project_id:D.INTEGER,item_id:D.INTEGER,actor_id:D.INTEGER,actor_name:D.STRING,action:D.STRING,changes:D.TEXT},{tableName:'monitoring_events'});
