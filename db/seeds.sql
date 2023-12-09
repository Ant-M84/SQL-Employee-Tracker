INSERT INTO department (name)
VALUES 
('Production'), 
('Marketing'), 
('Human Resources'), 
('Management'); 

INSERT INTO roles (title, salary, department_id)
VALUES 
('Production Assistant', 45000, 1), 
('Production Lead', 50000, 1), 
('Marketing Consultant', 60000, 2), 
('Employee Relations', 60000, 3), 
('Production Manager', 75000, 4), 
('Marketing Manager', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Anthony', 'Anderson', 1, 6),
('Bob', 'Boon', 2, 6),
('Claire', 'Cook', 6, NULL),
('Duke', 'Davidson', 1, 6),
('Eric', 'Elkington', 4, NULL),
('Faith', 'Flint', 5, NULL),
('Greg', 'Garret', 3, 3),
('Harry', 'Hill', 1, 6);