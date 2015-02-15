<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\IO\Console;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class Dashboard
{
    public function getSystemStatus($args)
    {
        $result = array();

        $result = array_merge($result, $this->_getLastModified());
        $result = array_merge($result, $this->_getDiskUsage());
        $result = array_merge($result, $this->_getUptime());
        $result = array_merge($result, $this->_getUserCount());

        return $result;
    }

    private function _getLastModified(){
        $lastModified = date("d.m.Y");
        return array(
            "Last Modified" => $lastModified,
        );
    }

    private function _getDiskUsage(){
        $diskUsage = 'Unknown';
        return array(
            "Disk Usage" => $diskUsage,
        );
    }

    private function _getUptime(){
        $uptimeTime = Console::passthru('uptime | awk \'{printf $3}\' 2>&1');
        $uptimeUnit = Console::passthru('uptime | awk \'{printf $4}\' 2>&1');
        $uptimeStr = str_replace(',', '', $uptimeTime." ".$uptimeUnit);

        return array(
            "Uptime" => $uptimeStr,
        );
    }

    private function _getUserCount(){
        $timeThatStillCounts = time() -600; // 10 minutes old sessions are counted
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('session')->where('modified > '.$timeThatStillCounts);
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        $count  = 0;
        $loggedUsers = '';
        foreach ($results as $row) {
            $oldSession = $_SESSION;
            session_decode($row['data']);
            $data = $_SESSION['Zend_Auth']['storage'];
            $_SESSION = $oldSession;

            if ($loggedUsers) $loggedUsers .= ', ';
            $loggedUsers .= $data['username'];
            $count++;
        }

        return array(
            "Logged Users count" => $count,
            "Logged Users" => $loggedUsers,
        );
    }

}
