import React from "react";
import CurrentTask from "../../components/SharedComponents/CurrentTask/CurrentTask";
import TaskFilters from "../../components/TasksComponents/TaskFilters/TaskFilters";
import TaskStats from "../../components/TasksComponents/TaskStats/TaskStats";
import TasksTable from "../../components/SharedComponents/TasksTable/TasksTable";
import { getTaskProject, formatElapsedTime } from "./tasksFunctions";
import { useTasks } from "./tasksHooks";
import "./Tasks.css";

const Tasks: React.FC = () => {
    const {
        filteredTasks,
        loadingTaskIds,
        currentTaskData,
        elapsedTime,
        activeSession,
        userProjects,
        searchTerm,
        projectFilter,
        statusFilter,
        dueDateFilter,
        stats,
        responsiveColumns,
        isAuthenticated,
        user,
        setSearchTerm,
        setProjectFilter,
        setStatusFilter,
        setDueDateFilter,
        handleCellValueChange,
    } = useTasks();

    if (!isAuthenticated || !user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="tasks-page">
            <h1 className="page-title">Tasks</h1>

            <TaskFilters
                searchTerm={searchTerm}
                projectFilter={projectFilter}
                statusFilter={statusFilter}
                dueDateFilter={dueDateFilter}
                onSearchChange={setSearchTerm}
                onProjectFilterChange={setProjectFilter}
                onStatusFilterChange={setStatusFilter}
                onDueDateFilterChange={setDueDateFilter}
                projectOptions={userProjects}
            />

            <TaskStats
                activeTasks={stats.activeTasks}
                completedTasks={stats.completedTasks}
                dueToday={stats.dueToday}
                completedThisMonth={stats.completedThisMonth}
            />

            <div className="current-task-wrapper">
                {currentTaskData && (
                    <CurrentTask
                        taskId={currentTaskData.id}
                        taskName={currentTaskData.name}
                        category={getTaskProject(currentTaskData)}
                        estimatedTime={currentTaskData.estimatedTime || "0 hrs"}
                        progress={currentTaskData.progress || 0}
                        elapsedTime={formatElapsedTime(elapsedTime)}
                        sessions={activeSession ? 1 : 0}
                        totalTime={
                            currentTaskData.hours_spent
                                ? `${currentTaskData.hours_spent}h total`
                                : "0h 0m total"
                        }
                        projectId={String(currentTaskData.project_id || "")}
                    />
                )}
            </div>

            <div className="tasks-table-container">
                <TasksTable
                    tasks={filteredTasks}
                    columns={responsiveColumns}
                    onCellValueChange={handleCellValueChange}
                    loadingTaskIds={loadingTaskIds}
                    hideFooter={filteredTasks.length <= 10}
                    editableFields={[]}
                    disableEditing={true}
                />
            </div>
        </div>
    );
};

export default Tasks;
