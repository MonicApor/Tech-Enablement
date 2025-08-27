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
            ['Last Name' => 'Nishida', 'Middle Name' => '-', 'First Name' => 'Toshihiko', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'System Admin', 'Hire Date' => '10/01/2022', 'Email' => 'nishida.t@sprobe.com'],
            ['Last Name' => 'Pejana', 'Middle Name' => 'Villanueva', 'First Name' => 'Marie Claire Yaxien', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '10/07/2019', 'Email' => 'pejana.mc@sprobe.com'],
            ['Last Name' => 'Otadoy', 'Middle Name' => 'Geotoro', 'First Name' => 'Glenn Vincent', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '11/04/2019', 'Email' => 'otadoy.gv@sprobe.com'],
            ['Last Name' => 'Resma', 'Middle Name' => 'Paduga', 'First Name' => 'Stella Maris', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '11/04/2019', 'Email' => 'paduga.sm@sprobe.com'],
            ['Last Name' => 'Cariño', 'Middle Name' => 'Navarro', 'First Name' => 'John Kenneth', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Batch Monitoring', 'Hire Date' => '10/01/2021', 'Email' => 'carino.jk@sprobe.com'],
            ['Last Name' => 'Camoro', 'Middle Name' => 'Geverola', 'First Name' => 'Leobert', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '04/01/2022', 'Email' => 'camoro.l@sprobe.com'],
            ['Last Name' => 'Caminero', 'Middle Name' => 'Taparan', 'First Name' => 'Shiena Marie', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '04/05/2022', 'Email' => 'caminero.sm@sprobe.com'],
            ['Last Name' => 'Arche', 'Middle Name' => 'Tanginan', 'First Name' => 'Ruben', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '05/02/2022', 'Email' => 'arche.r@sprobe.com'],
            ['Last Name' => 'Giganto', 'Middle Name' => 'Abellana', 'First Name' => 'Jennifer', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '05/01/2014', 'Email' => 'giganto.ja@sprobe.com'],
            ['Last Name' => 'Lauron', 'Middle Name' => 'Biaño', 'First Name' => 'Bianca Benedicte', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Group Leader', 'Hire Date' => '04/01/2016', 'Email' => 'biano.bbs@sprobe.com'],
            ['Last Name' => 'Manipes', 'Middle Name' => 'Gica', 'First Name' => 'Arjun', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '05/01/2016', 'Email' => 'manipes.ag@sprobe.com'],
            ['Last Name' => 'Nacua', 'Middle Name' => 'Dacullo', 'First Name' => 'Kysha Faye', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '05/01/2016', 'Email' => 'nacua.kfd@sprobe.com'],
            ['Last Name' => 'Comahig', 'Middle Name' => 'Ceniza', 'First Name' => 'Clieve', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Technical Lead', 'Hire Date' => '04/16/2018', 'Email' => 'comahig.cc@sprobe.com'],
            ['Last Name' => 'Galorio', 'Middle Name' => 'Ando', 'First Name' => 'Briane  Allan', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Leader', 'Hire Date' => '07/16/2018', 'Email' => 'galorio.baa@sprobe.com'],
            ['Last Name' => 'Litrada II', 'Middle Name' => 'Cerna', 'First Name' => 'Audie Michael', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '09/03/2018', 'Email' => 'litrada.amc@sprobe.com'],
            ['Last Name' => 'Mativo', 'Middle Name' => 'Gallardo', 'First Name' => 'Michael', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '10/01/2018', 'Email' => 'mativo.m@sprobe.com'],
            ['Last Name' => 'Roa', 'Middle Name' => 'Sakano', 'First Name' => 'Yurika', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Japanese', 'Hire Date' => '01/07/2019', 'Email' => 'roa.ys@sprobe.com'],
            ['Last Name' => 'Saromines', 'Middle Name' => 'Cayas', 'First Name' => 'John Ivans', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Quality Assurance', 'Hire Date' => '03/16/2019', 'Email' => 'saromines.jic@sprobe.com'],
            ['Last Name' => 'Damulo', 'Middle Name' => 'Anton', 'First Name' => 'John Leroy', 'Immediate Supervisor' => 'Briane  Allan Galorio', 'Position' => 'Quality Assurance', 'Hire Date' => '03/20/2019', 'Email' => 'damulo.jla@sprobe.com'],
            ['Last Name' => 'Piquero', 'Middle Name' => 'Asaldo', 'First Name' => 'Jay', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '05/16/2019', 'Email' => 'piquero.ja@sprobe.com'],
            ['Last Name' => 'Melecio', 'Middle Name' => 'Tacadao', 'First Name' => 'Adam', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '06/03/2019', 'Email' => 'melecio.at@sprobe.com'],
            ['Last Name' => 'Gabutin', 'Middle Name' => 'Basaya', 'First Name' => 'Louie', 'Immediate Supervisor' => 'Jonathan Vicente Canillo', 'Position' => 'Group Leader', 'Hire Date' => '08/01/2019', 'Email' => 'gabutin.lb@sprobe.com'],
            ['Last Name' => 'Mahinlo', 'Middle Name' => 'Itable', 'First Name' => 'Marnito', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Technical Lead', 'Hire Date' => '08/01/2019', 'Email' => 'mahinlo.mi@sprobe.com'],
            ['Last Name' => 'Dabuco', 'Middle Name' => 'Villarin', 'First Name' => 'Jade', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '09/02/2019', 'Email' => 'dabuco.jv@sprobe.com'],
            ['Last Name' => 'Tampus', 'Middle Name' => 'Pilones', 'First Name' => 'Michael', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Workplace', 'Hire Date' => '09/20/2019', 'Email' => 'tampus.mp@sprobe.com'],
            ['Last Name' => 'Deloso', 'Middle Name' => 'Canete', 'First Name' => 'Thea Marie', 'Immediate Supervisor' => 'Jonathan Vicente Canillo', 'Position' => 'Group Leader', 'Hire Date' => '03/01/2021', 'Email' => 'deloso.tm@sprobe.com'],
            ['Last Name' => 'Lagura', 'Middle Name' => 'Villeno', 'First Name' => 'Charl Rio', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Leader', 'Hire Date' => '03/01/2021', 'Email' => 'lagura.cr@sprobe.com'],
            ['Last Name' => 'Victoriano', 'Middle Name' => 'Barbasa', 'First Name' => 'Eric', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '03/01/2021', 'Email' => 'victoriano.e@sprobe.com'],
            ['Last Name' => 'Canillo', 'Middle Name' => 'Polloso', 'First Name' => 'Jonathan Vicente', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Leader', 'Hire Date' => '05/20/2021', 'Email' => 'canillo.jv@sprobe.com'],
            ['Last Name' => 'Tutor', 'Middle Name' => 'Berdin', 'First Name' => 'Virnon Nel', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Technical Lead', 'Hire Date' => '06/25/2021', 'Email' => 'tutor.vn@sprobe.com'],
            ['Last Name' => 'Rodriguez', 'Middle Name' => 'Doroy', 'First Name' => 'John Nelon', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Batch Monitoring', 'Hire Date' => '09/01/2021', 'Email' => 'rodriguez.jn@sprobe.com'],
            ['Last Name' => 'Galbizo', 'Middle Name' => 'Paglinawan', 'First Name' => 'Mc Gyver', 'Immediate Supervisor' => 'Briane  Allan Galorio', 'Position' => 'Quality Assurance', 'Hire Date' => '09/10/2021', 'Email' => 'galbizo.mg@sprobe.com'],
            ['Last Name' => 'Tibon', 'Middle Name' => 'Cosido', 'First Name' => 'Peter Anthony', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '12/06/2021', 'Email' => 'tibon.pa@sprobe.com'],
            ['Last Name' => 'Ruizo', 'Middle Name' => 'Monteza', 'First Name' => 'John Lorenz', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Group Leader', 'Hire Date' => '08/05/2021', 'Email' => 'ruizo.jl@sprobe.com'],
            ['Last Name' => 'Bordadora', 'Middle Name' => 'Borgonia', 'First Name' => 'Cristy', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Quality Assurance', 'Hire Date' => '03/01/2022', 'Email' => 'bordadora.c@sprobe.com'],
            ['Last Name' => 'Eslava', 'Middle Name' => 'Caranto', 'First Name' => 'Geoffrey', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '02/07/2022', 'Email' => 'eslava.g@sprobe.com'],
            ['Last Name' => 'Hitosis', 'Middle Name' => 'Bebasa', 'First Name' => 'Jeffrey', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '03/01/2022', 'Email' => 'hitosis.j@sprobe.com'],
            ['Last Name' => 'Catubig', 'Middle Name' => 'Parampan', 'First Name' => 'Clifford', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Technical Lead', 'Hire Date' => '03/21/2022', 'Email' => 'catubig.c@sprobe.com'],
            ['Last Name' => 'Sanchez', 'Middle Name' => 'Catapang', 'First Name' => 'Alvin', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '03/15/2022', 'Email' => 'sanchez.a@sprobe.com'],
            ['Last Name' => 'Labra', 'Middle Name' => 'Canonigo', 'First Name' => 'Ma. Teresa', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Group Leader', 'Hire Date' => '06/01/2022', 'Email' => 'labra.mt@sprobe.com'],
            ['Last Name' => 'Verdida', 'Middle Name' => 'Presbitero', 'First Name' => 'Archristian', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Software Engineer', 'Hire Date' => '05/02/2022', 'Email' => 'verdida.a@sprobe.com'],
            ['Last Name' => 'Bascar', 'Middle Name' => 'Uy', 'First Name' => 'Milodie', 'Immediate Supervisor' => 'Thea Marie Deloso', 'Position' => 'Nurse', 'Hire Date' => '07/01/2022', 'Email' => 'bascar.m@sprobe.com'],
            ['Last Name' => 'Tomeoku', 'Middle Name' => '', 'First Name' => 'Susumu', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Japanese', 'Hire Date' => '06/01/2022', 'Email' => 'tomeoku.s@sprobe.com'],
            ['Last Name' => 'Tanaka', 'Middle Name' => '-', 'First Name' => 'Tatsunori', 'Immediate Supervisor' => 'Toshihiko Nishida', 'Position' => 'Leader', 'Hire Date' => '01/04/2024', 'Email' => 'tanaka.t@sprobe.com'],
            ['Last Name' => 'Casan', 'Middle Name' => 'Punag', 'First Name' => 'Norhata', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Leader', 'Hire Date' => '04/29/2024', 'Email' => 'casan.n@sprobe.com'],
            ['Last Name' => 'Abitria', 'Middle Name' => 'Filosopo', 'First Name' => 'Cray Pixel', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'abitria.cp@sprobe.com'],
            ['Last Name' => 'Cañete', 'Middle Name' => 'Cuyos', 'First Name' => 'Lyle', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'canete.l@sprobe.com'],
            ['Last Name' => 'Eyac', 'Middle Name' => '-', 'First Name' => 'Dwight', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'eyac.d@sprobe.com'],
            ['Last Name' => 'Fat', 'Middle Name' => 'Yap', 'First Name' => 'Moses Anthony', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'fat.ma@sprobe.com'],
            ['Last Name' => 'Jacalan', 'Middle Name' => 'Binarao', 'First Name' => 'Clarisse Yvonne', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'jacalan.cy@sprobe.com'],
            ['Last Name' => 'Panis', 'Middle Name' => 'Lomentigar', 'First Name' => 'Kim Darius', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'panis.kd@sprobe.com'],
            ['Last Name' => 'Parinasan', 'Middle Name' => 'Ardina', 'First Name' => 'Christ Rile', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'parinasan.cr@sprobe.com'],
            ['Last Name' => 'Tindoy', 'Middle Name' => 'Banzon', 'First Name' => 'Dave Arlu Niño', 'Immediate Supervisor' => 'Tatsunori Tanaka', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'tindoy.dan@sprobe.com'],
            ['Last Name' => 'Ubal', 'Middle Name' => 'Bustamante', 'First Name' => 'Janine', 'Immediate Supervisor' => 'Bianca Benedicte Lauron', 'Position' => 'Software Engineer', 'Hire Date' => '07/01/2024', 'Email' => 'ubal.j@sprobe.com'],
            ['Last Name' => 'Iligan', 'Middle Name' => 'Bacus', 'First Name' => 'Gemar', 'Immediate Supervisor' => 'Jonathan Vicente Canillo', 'Position' => 'Infrastructure', 'Hire Date' => '11/13/2024', 'Email' => 'iligan.g@sprobe.com'],
            ['Last Name' => 'Doyohim', 'Middle Name' => 'Baguio', 'First Name' => 'Florito', 'Immediate Supervisor' => 'Ma. Teresa Labra', 'Position' => 'Technical Lead', 'Hire Date' => '11/25/2024', 'Email' => 'doyohim.f@sprobe.com'],
            ['Last Name' => 'Cabaluna', 'Middle Name' => '', 'First Name' => 'Kurt Desmond', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025', 'Email' => 'cabaluna.k@sprobe.com'],
            ['Last Name' => 'Dorado', 'Middle Name' => 'Frondoza', 'First Name' => 'Giliane Aze', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025', 'Email' => 'dorado.g@sprobe.com'],
            ['Last Name' => 'Pacatang', 'Middle Name' => 'Mandal', 'First Name' => 'Oliver Grant', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025', 'Email' => 'pacatang.o@sprobe.com'],
            ['Last Name' => 'Rubiato', 'Middle Name' => 'Ranes', 'First Name' => 'John Clement', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025', 'Email' => 'rubiato.j@sprobe.com'],
            ['Last Name' => 'Tacumba Jr.', 'Middle Name' => 'Caliso', 'First Name' => 'Ernesto', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025', 'Email' => 'tacumba.e@sprobe.com'],
            ['Last Name' => 'Bacaling', 'Middle Name' => 'Ruiz', 'First Name' => 'Angelo Rey', 'Immediate Supervisor' => 'Milodie Bascar', 'Position' => 'Software Engineer', 'Hire Date' => '06/23/2025', 'Email' => 'bacaling.a@sprobe.com'],
            ['Last Name' => 'Nene', 'Middle Name' => 'Araneta', 'First Name' => 'Jannah Mae', 'Immediate Supervisor' => 'Norhata Casan', 'Position' => 'Junior Accountant', 'Hire Date' => '07/23/2025', 'Email' => 'nene.jm@sprobe.com'],
            ['Last Name' => 'Palanggalan', 'Middle Name' => 'Lumanggal', 'First Name' => 'Rasul Richy', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '08/01/2025', 'Email' => 'palanggalan.rr@sprobe.com'],
            ['Last Name' => 'Tomaquin', 'Middle Name' => 'Isugan', 'First Name' => 'Rhea Bell', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '08/01/2025', 'Email' => 'tomaquin.rb@sprobe.com'],
            ['Last Name' => 'Apor', 'Middle Name' => 'Mamalias', 'First Name' => 'Monica Claire', 'Immediate Supervisor' => 'Louie Gabutin', 'Position' => 'Software Engineer', 'Hire Date' => '08/01/2025', 'Email' => 'apor.mc@sprobe.com'],
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
                
                $email = trim($employee['Email']);
                
                $hireDate = null;
                if (!empty($employee['Hire Date'])) {
                    try {
                        $hireDate = Carbon::createFromFormat('m/d/Y', $employee['Hire Date'])->format('Y-m-d');
                    } catch (\Exception $e) {
                        $errors[] = "Invalid hire date for {$fullName}: {$employee['Hire Date']}";
                        continue;
                    }
                }
                
                $existingUser = User::where('email', $email)->first();
                
                if (!$existingUser) {
                    User::create([
                        'first_name' => $firstName,
                        'middle_name' => $middleName,
                        'last_name' => $lastName,
                        'name' => $fullName,
                        'email' => $email,
                        'immediate_supervisor' => $employee['Immediate Supervisor'],
                        'hire_date' => $hireDate,
                        'role' => $employee['Position'],
                    ]);
                    $imported++;
                } else {
                    $existingUser->update([
                        'first_name' => $firstName,
                        'middle_name' => $middleName,
                        'last_name' => $lastName,
                        'name' => $fullName,
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
