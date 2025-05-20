import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
    selectAllTasks,
    selectLoadingTaskIds,
    selectCurrentTask
} from "../../store/slices/tasksSlice";
import { selectActiveSession, selectElapsedTime } from "../../store/slices/timeTrackingsSlice";
import { GridColDef } from "@mui/x-data-grid";
import { ProjectTask } from "../../services/projectsService";
import {
    renderStatusCell,
    renderProjectCell,
} from "../../components/SharedComponents/TasksTable/TableCellRenderers";
import {
    getTaskProject,
    calculateTaskStats,
    makeColumnsEditable,
    makeResponsiveColumns,
    filterTasks,
    parseDate,
    formatDate,
    extractUniqueProjects
} from "./tasksFunctions";
import { loadTasksData, updateTaskValue } from "./tasksActions";

export const useTasks = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const tasks = useAppSelector(selectAllTasks);
    const loadingTaskIds = useAppSelector(selectLoadingTaskIds);
    const currentTaskData = useAppSelector(selectCurrentTask);
    const activeSession = useAppSelector(selectActiveSession);
    const elapsedTime = useAppSelector(selectElapsedTime);
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState("");
    const [projectFilter, setProjectFilter] = useState("All Projects");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [dueDateFilter, setDueDateFilter] = useState("Due Date");
    const [filteredTasks, setFilteredTasks] = useState<ProjectTask[]>(tasks);
    const [userProjects, setUserProjects] = useState<string[]>(["All Projects"]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/auth");
        }
    }, [isAuthenticated, user, navigate]);


    useEffect(() => {
        if (user?.id) {
            loadTasksData(Number(user.id), dispatch);
        }
    }, [dispatch, user]);


    useEffect(() => {
        const projects = extractUniqueProjects(tasks);
        setUserProjects(projects);
    }, [tasks]);


    useEffect(() => {
        const filtered = filterTasks(tasks, searchTerm, projectFilter, statusFilter, dueDateFilter);
        setFilteredTasks(filtered);
    }, [searchTerm, projectFilter, statusFilter, dueDateFilter, tasks]);


    const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setFilteredTasks([...filteredTasks]);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [filteredTasks]);


    const columns: GridColDef[] = useMemo(() => [
        {
            field: "name",
            headerName: "TASK NAME",
            flex: 2.5,
            minWidth: 200,
            editable: true,
        },
        {
            field: "project",
            headerName: "PROJECT",
            flex: 1.5,
            minWidth: 150,
            editable: true,
            renderCell: (params) =>
                renderProjectCell({
                    ...params,
                    value: getTaskProject(params.row),
                }),
            valueGetter: (params) => getTaskProject(params.row),
        },
        {
            field: "estimatedTime",
            headerName: "ETC",
            flex: 1,
            minWidth: 100,
            editable: true,
        },
        {
            field: "dueDate",
            headerName: "DUE DATE",
            flex: 1,
            minWidth: 110,
            editable: true,
            type: "date",
            valueGetter: (params) => parseDate(params.value),
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "status",
            headerName: "STATUS",
            flex: 1,
            minWidth: 120,
            editable: true,
            type: "singleSelect",
            valueOptions: ["In Progress", "Completed", "Not Started"],
            renderCell: renderStatusCell,
        },
    ], []);


    const enhancedColumns = useMemo(() => makeColumnsEditable(columns), [columns]);


    const responsiveColumns = useMemo(() =>
        makeResponsiveColumns(enhancedColumns, windowWidth),
        [enhancedColumns, windowWidth]);


    const handleCellValueChange = (
        taskId: string | number,
        field: string,
        value: any
    ) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.project_id) {
            updateTaskValue(task.project_id, taskId, field, value, dispatch);
        }
    };

    return {
        tasks,
        filteredTasks,
        loadingTaskIds,
        currentTaskData,
        activeSession,
        elapsedTime,
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
    };
}; 