<?php
namespace Sic\Admin\Modules\Users;

class ListUsers {
    public function listUsers($args) {
        $users = array(
            array("username" => "TestUser1"),
            array("username" => "TestUser2")
        );

        return array(
            "users" => $users
        );
    }
}
