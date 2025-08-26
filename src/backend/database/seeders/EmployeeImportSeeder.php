<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class EmployeeImportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            ['Last Name' => 'Nishida', 'Middle Name' => '-', 'First Name' => 'Toshihiko', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Administrator', 'Hire Date' => '10/01/2022'],
            ['Last Name' => 'Pejana', 'Middle Name' => 'Villanueva', 'First Name' => 'Marie Claire Yaxien', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '10/07/2019'],
            ['Last Name' => 'Otadoy', 'Middle Name' => 'Geotoro', 'First Name' => 'Glenn Vincent', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '11/04/2019'],
            ['Last Name' => 'Resma', 'Middle Name' => 'Paduga', 'First Name' => 'Stella Maris', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '11/04/2019'],
            ['Last Name' => 'Cariño', 'Middle Name' => 'Navarro', 'First Name' => 'John Kenneth', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '10/01/2021'],
            ['Last Name' => 'Camoro', 'Middle Name' => 'Geverola', 'First Name' => 'Leobert', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '04/01/2022'],
            ['Last Name' => 'Caminero', 'Middle Name' => 'Taparan', 'First Name' => 'Shiena Marie', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '04/05/2022'],
            ['Last Name' => 'Arche', 'Middle Name' => 'Tanginan', 'First Name' => 'Ruben', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '05/02/2022'],
            ['Last Name' => 'Giganto', 'Middle Name' => 'Abellana', 'First Name' => 'Jennifer', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '05/01/2014'],
            ['Last Name' => 'Lauron', 'Middle Name' => 'Biaño', 'First Name' => 'Bianca Benedicte', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Manager', 'Hire Date' => '04/01/2016'],
            ['Last Name' => 'Manipes', 'Middle Name' => 'Gica', 'First Name' => 'Arjun', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '05/01/2016'],
            ['Last Name' => 'Nacua', 'Middle Name' => 'Dacullo', 'First Name' => 'Kysha Faye', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '05/01/2016'],
            ['Last Name' => 'Galinea', 'Middle Name' => 'Maranga', 'First Name' => 'John Kono Davince', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '07/11/2017'],
            ['Last Name' => 'Comahig', 'Middle Name' => 'Ceniza', 'First Name' => 'Clieve', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Technical Lead', 'Hire Date' => '04/16/2018'],
            ['Last Name' => 'Galorio', 'Middle Name' => 'Ando', 'First Name' => 'Briane  Allan', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Manager', 'Hire Date' => '07/16/2018'],
            ['Last Name' => 'Litrada II', 'Middle Name' => 'Cerna', 'First Name' => 'Audie Michael', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '09/03/2018'],
            ['Last Name' => 'Mativo', 'Middle Name' => 'Gallardo', 'First Name' => 'Michael', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '10/01/2018'],
            ['Last Name' => 'Roa', 'Middle Name' => 'Sakano', 'First Name' => 'Yurika', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Japanese', 'Hire Date' => '01/07/2019'],
            ['Last Name' => 'Saromines', 'Middle Name' => 'Cayas', 'First Name' => 'John Ivans', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Quality Assurance', 'Hire Date' => '03/16/2019'],
            ['Last Name' => 'Damulo', 'Middle Name' => 'Anton', 'First Name' => 'John Leroy', 'Immediate Supervisor' => 'Briane  Allan Galorio', 'Position' => 'Quality Assurance', 'Hire Date' => '03/20/2019'],
            ['Last Name' => 'Piquero', 'Middle Name' => 'Asaldo', 'First Name' => 'Jay', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '05/16/2019'],
            ['Last Name' => 'Melecio', 'Middle Name' => 'Tacadao', 'First Name' => 'Adam', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '06/03/2019'],
            ['Last Name' => 'Gabutin', 'Middle Name' => 'Basaya', 'First Name' => 'Louie', 'Immediate Supervisor' => 'Jonathan Vicente Canillo', 'Position' => 'PMO', 'Hire Date' => '08/01/2019'],
            ['Last Name' => 'Mahinlo', 'Middle Name' => 'Itable', 'First Name' => 'Marnito', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Technical Lead', 'Hire Date' => '08/01/2019'],
            ['Last Name' => 'Dabuco', 'Middle Name' => 'Villarin', 'First Name' => 'Jade', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '09/02/2019'],
            ['Last Name' => 'Tampus', 'Middle Name' => 'Pilones', 'First Name' => 'Michael', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Receptionist', 'Hire Date' => '09/20/2019'],
            ['Last Name' => 'Deloso', 'Middle Name' => 'Canete', 'First Name' => 'Thea Marie', 'Immediate Supervisor' => 'Jonathan Vicente Canillo', 'Position' => 'Manager', 'Hire Date' => '03/01/2021'],
            ['Last Name' => 'Lagura', 'Middle Name' => 'Villeno', 'First Name' => 'Charl Rio', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'BA', 'Hire Date' => '03/01/2021'],
            ['Last Name' => 'Victoriano', 'Middle Name' => 'Barbasa', 'First Name' => 'Eric', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '03/01/2021'],
            ['Last Name' => 'Canillo', 'Middle Name' => 'Polloso', 'First Name' => 'Jonathan Vicente', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Administrator', 'Hire Date' => '05/20/2021'],
            ['Last Name' => 'Tutor', 'Middle Name' => 'Berdin', 'First Name' => 'Virnon Nel', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Technical Lead', 'Hire Date' => '06/25/2021'],
            ['Last Name' => 'Rodriguez', 'Middle Name' => 'Doroy', 'First Name' => 'John Nelon', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '09/01/2021'],
            ['Last Name' => 'Galbizo', 'Middle Name' => 'Paglinawan', 'First Name' => 'Mc Gyver', 'Immediate Supervisor' => 'Briane  Allan Galorio', 'Position' => 'Software Engineer', 'Hire Date' => '09/10/2021'],
            ['Last Name' => 'Tibon', 'Middle Name' => 'Cosido', 'First Name' => 'Peter Anthony', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '12/06/2021'],
            ['Last Name' => 'Ruizo', 'Middle Name' => 'Monteza', 'First Name' => 'John Lorenz', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Manager \ Technical Lead', 'Hire Date' => '08/05/2021'],
            ['Last Name' => 'Bordadora', 'Middle Name' => 'Borgonia', 'First Name' => 'Cristy', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Quality Assurance', 'Hire Date' => '03/01/2022'],
            ['Last Name' => 'Eslava', 'Middle Name' => 'Caranto', 'First Name' => 'Geoffrey', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '02/07/2022'],
            ['Last Name' => 'Hitosis', 'Middle Name' => 'Bebasa', 'First Name' => 'Jeffrey', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '03/01/2022'],
            ['Last Name' => 'Catubig', 'Middle Name' => 'Parampan', 'First Name' => 'Clifford', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '03/21/2022'],
            ['Last Name' => 'Sanchez', 'Middle Name' => 'Catapang', 'First Name' => 'Alvin', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '03/15/2022'],
            ['Last Name' => 'Baltazar', 'Middle Name' => 'Briones', 'First Name' => 'Mara Katrina', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '04/20/2022'],
            ['Last Name' => 'Labra', 'Middle Name' => 'Canonigo', 'First Name' => 'Ma. Teresa', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Manager', 'Hire Date' => '06/01/2022'],
            ['Last Name' => 'Verdida', 'Middle Name' => 'Presbitero', 'First Name' => 'Archristian', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Software Engineer', 'Hire Date' => '05/02/2022'],
            ['Last Name' => 'Bascar', 'Middle Name' => 'Uy', 'First Name' => 'Milodie', 'Immediate Supervisor' => 'Thea Marie Deloso', 'Position' => 'HR \ Clinic Nurse', 'Hire Date' => '07/01/2022'],
            ['Last Name' => 'Tomeoku', 'Middle Name' => '', 'First Name' => 'Susumu', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Japanese', 'Hire Date' => '06/01/2022'],
            ['Last Name' => 'Tanaka', 'Middle Name' => '-', 'First Name' => 'Tatsunori', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Japanese', 'Hire Date' => '01/04/2024'],
            ['Last Name' => 'Casan', 'Middle Name' => 'Punag', 'First Name' => 'Norhata', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Accountant', 'Hire Date' => '04/29/2024'],
            ['Last Name' => 'Abitria', 'Middle Name' => 'Filosopo', 'First Name' => 'Cray Pixel', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Cañete', 'Middle Name' => 'Cuyos', 'First Name' => 'Lyle', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Eyac', 'Middle Name' => '-', 'First Name' => 'Dwight', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Fat', 'Middle Name' => 'Yap', 'First Name' => 'Moses Anthony', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Jacalan', 'Middle Name' => 'Binarao', 'First Name' => 'Clarisse Yvonne', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Panis', 'Middle Name' => 'Lomentigar', 'First Name' => 'Kim Darius', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Parinasan', 'Middle Name' => 'Ardina', 'First Name' => 'Christ Rile', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Tindoy', 'Middle Name' => 'Banzon', 'First Name' => 'Dave Arlu Niño', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Ubal', 'Middle Name' => 'Bustamante', 'First Name' => 'Janine', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024'],
            ['Last Name' => 'Iligan', 'Middle Name' => 'Bacus', 'First Name' => 'Gemar', 'Immediate Supervisor' => 'Jonathan Vicente Canillo', 'Position' => 'IT Technical Support', 'Hire Date' => '11/13/2024'],
            ['Last Name' => 'Doyohim', 'Middle Name' => 'Baguio', 'First Name' => 'Florito', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '11/25/2024'],
            ['Last Name' => 'Cabaluna', 'Middle Name' => '', 'First Name' => 'Kurt Desmond', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025'],
            ['Last Name' => 'Dorado', 'Middle Name' => 'Frondoza', 'First Name' => 'Giliane Aze', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025'],
            ['Last Name' => 'Pacatang', 'Middle Name' => 'Mandal', 'First Name' => 'Oliver Grant', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025'],
            ['Last Name' => 'Rubiato', 'Middle Name' => 'Ranes', 'First Name' => 'John Clement', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025'],
            ['Last Name' => 'Tacumba Jr.', 'Middle Name' => 'Caliso', 'First Name' => 'Ernesto', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025'],
            ['Last Name' => 'Bacaling', 'Middle Name' => 'Ruiz', 'First Name' => 'Angelo Rey', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025'],
            ['Last Name' => 'Nene', 'Middle Name' => 'Araneta', 'First Name' => 'Jannah Mae', 'Immediate Supervisor' => 'Norhata Casan', 'Position' => 'Junior Accountant', 'Hire Date' => '07/23/2025'],
            ['Last Name' => 'Palanggalan', 'Middle Name' => 'Lumanggal', 'First Name' => 'Rasul Richy', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '08/01/2025'],
            ['Last Name' => 'Tomaquin', 'Middle Name' => 'Isugan', 'First Name' => 'Rhea Bell', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '08/01/2025'],
            ['Last Name' => 'Apor', 'Middle Name' => 'Mamalias', 'First Name' => 'Monica Claire', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '08/01/2025'],
        ];

        $imported = 0;
        $updated = 0;
        $errors = [];

        foreach ($employees as $employee) {
            try {
                $firstName = trim($employee['First Name']);
                $middleName = trim($employee['Middle Name']);
                $lastName = trim($employee['Last Name']);
                
                if ($middleName === '-' || $middleName === '') {
                    $middleName = '';
                }
                
                $fullName = trim($firstName . ' ' . $middleName . ' ' . $lastName);
                
                $email = strtolower(str_replace(' ', '.', $fullName)) . '@placeholder.company.com';
                
                $hireDate = null;
                if (!empty($employee['Hire Date'])) {
                    try {
                        $hireDate = Carbon::createFromFormat('m/d/Y', $employee['Hire Date'])->format('Y-m-d');
                    } catch (\Exception $e) {
                        $errors[] = "Invalid hire date for {$fullName}: {$employee['Hire Date']}";
                        continue;
                    }
                }
                
                $existingUser = User::where('name', $fullName)->first();
                
                if (!$existingUser) {
                    User::create([
                        'name' => $fullName,
                        'email' => $email,
                        'immediate_supervisor' => $employee['Immediate Supervisor'],
                        'hire_date' => $hireDate,
                        'role' => $employee['Position'],
                    ]);
                    $imported++;
                } else {
                    $existingUser->update([
                        'email' => $email,
                        'immediate_supervisor' => $employee['Immediate Supervisor'],
                        'hire_date' => $hireDate,
                        'role' => $employee['Position'],
                    ]);
                    $updated++;
                }
            } catch (\Exception $e) {
                $errors[] = "Error processing {$employee['First Name']} {$employee['Last Name']}: " . $e->getMessage();
            }
        }

        $this->command->info("Import completed:");
        $this->command->info("- {$imported} new users imported");
        $this->command->info("- {$updated} existing users updated");
        
        if (!empty($errors)) {
            $this->command->error("Errors encountered:");
            foreach ($errors as $error) {
                $this->command->error("- {$error}");
            }
        }
    }
}
