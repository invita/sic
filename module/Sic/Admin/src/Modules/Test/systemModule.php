<?php
namespace Sic\Admin\Modules;

class SystemModule {
    public function test($args) {
        return array(
            "foo" => "bar2",
            "alert" => "testAlert"
        );
    }
}
