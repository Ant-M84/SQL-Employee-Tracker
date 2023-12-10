// Call dependencies //
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

db.connect((err) => {
    if (err) throw err;
trackerMenu();
});

const trackerMenu = () => {
    inquirer.prompt ({  
        name: 'options',
        type: 'list',
        message: 'Welcome to Employee Tracker! Please select an option:',
        choices: [
            'View Departments',
            'View Roles',
            'View Employees',
            'Add a new Department',
            'Add a new Role',
            'Add a new Employee',
            'Update an existing Employee',
            'Exit',
            ],
    })
    .then(ans => {
        switch (ans.options) {
            case 'View Departments': viewDepartment();
                break;
            case 'View Roles': viewRoles();
                break;
            case 'View Employees': viewEmployees();
                break;
            case 'Add a new Department': addDepartment();
                break;
            case 'Add a new Role': addRole();
                break;
            case 'Add a new Employee': addEmployee();
                break;
            case 'Update an existing Employee': updateEmployee();
                break;
            case 'Exit':
                console.log('Employee Tracker session terminated!')
                process.exit();
        };
    })
    .catch(err => console.error(err));
};

const viewDepartment = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        err ? console.error(err) : console.table(res);
        trackerMenu();
    }) 
};

const viewRoles = () => {
    db.query(`SELECT * FROM roles`, (err, res) => {
        err ? console.error(err) : console.table(res);
        trackerMenu();
    })
};

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        err ? console.error(err) : console.table(res);   
        trackerMenu();
    })
};

const addDepartment = () => {
    inquirer.prompt(
        {
        type: 'input',
        message: "What is the name of the new Department?",
        name: "addDepartment"
        },
    )
    .then(ans => {
        db.query(`INSERT INTO department SET ?`,
            {
                name: ans.addDepartment,
            }
            );    
            trackerMenu();    
        })
};

const addRole = () => {
    db.query(`SELECT * FROM department`, (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
            return {
                name: department.name,
                value: department.id,
            }
        })
        inquirer.prompt (
        {
            type: 'input',
            message: "What is the name of the new Role?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the salary of the new Role?",
            name: "roleSalary"
        },
        {
            type: "list",
            message: "Which department is the role in?",
            choices: departments,
            name: departmentId
        }
    )
    .then(ans => {
        db.query(`INSERT INTO role SET ?`,
            {
            title: ans.roleTitle,
            salary: ans.roleSalary,
            department_id: ans.departmentId,
            }
        );
        trackerMenu();
        })   
    })
};

const addEmployee = () => {
    db.query(`SELECT * FROM role`, (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
            return {
                name: role.title,
                value: role.id,
            }
        })
        inquirer.prompt(
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the first name of the employee.'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the last name of the employee.'
            },
            {
                type: 'list',
                name: 'role',
                message: 'Enter the role of the employee.',
                choices: roles,
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Enter the manager ID of the employee.',
                choices: [3, 6]
            }
        )
        .then(ans => {
            db.query(`INSERT INTO employee SET ?`,
            {
                first_name: ans.firstName,
                last_name: ans.lastName,
                role_id: ans.role,
                manager_id: ans.managerId
            })
            trackerMenu();
        })
    })
};

const updateEmployee = () => {
    db.query(`SELECT * FROM employee`, (err, employees) => {
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        })

        db.query(`SELECT * FROM role`, (err, roles) => {
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            })
            inquirer.prompt(
                {
                    type: 'list',
                    name: 'selectEmployee',
                    message: 'Select employee to update their details.',
                    choices: employees,
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'What is the new role for the employee?',
                    choices: roles,
                }
            )
            .then(ans => {
                db.query(`UPDATE employee SET ? WHERE ?`,
                [
                    {
                        role_id: ans.newRole,
                    },
                    {
                        id: ans.selectEmployee,
                    }
                ])
                trackerMenu();
            })
        })
    })
}
