<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\IO\Console;

class Dashboard
{
    public function getSystemStatus($args)
    {
        $lastModified = date("d.m.Y");
        $diskUsage = 'Unknown';

        $uptimeTime = Console::passthru('uptime | awk \'{printf $3}\' 2>&1');
        $uptimeUnit = Console::passthru('uptime | awk \'{printf $4}\' 2>&1');
        $uptimeStr = str_replace(',', '', $uptimeTime." ".$uptimeUnit);

        $status = array(
            "Version" => "SIC v2.0",
            "Last Modified" => $lastModified,
            "Disk Usage" => $diskUsage,
            "Uptime" => $uptimeStr,
            /*
            "Vseh uporabnikov online" => $allUsersCount,
            "Prijavljeni uporabniki" => $usersStr,
            "Čas strežnika" => $uptime,
            "Zaposlenost procesorja" => $loadAvg,
            "Število procesov" => $procCount,
            "Obremenitev omrežja" => $netUsage,
            "" => "",
            "Število publikacij" => $pubCount,
            "Število citatov" => $citCount,
            "Število žrtev" => $zrtCount
            */
        );

        return $status;
    }
}
